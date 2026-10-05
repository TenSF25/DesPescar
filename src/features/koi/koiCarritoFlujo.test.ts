import { describe, expect, it, vi } from 'vitest';
import type { KoiOpcion } from './koi.types';
import {
  ejecutarFlujoCarrito,
  MENSAJE_HOTEL_SIN_QUITAR_VUELO,
  type DepsCarrito,
  type EstadiaAgregada,
} from './koiCarritoFlujo';

const opcion = {
  optionId: 'o1',
  tipo: 'COMBO',
  viajeros: 2,
  total: 10,
  moneda: 'ARS',
  motivo: '',
  vuelo: {
    departureFlightId: 'f1',
    returnFlightId: 'f2',
    departureFareId: 't1',
    returnFareId: 't2',
    aerolinea: 'X',
    numeroIda: '1',
    numeroVuelta: '2',
    salidaIda: '',
    llegadaIda: '',
    salidaVuelta: '',
    llegadaVuelta: '',
    precio: 1,
  },
  hotel: {
    hotelId: 'h1',
    hotelNombre: 'H',
    ciudad: 'C',
    tipoHabitacionId: 'th',
    tipoHabitacionNombre: 'D',
    checkIn: '2026-11-19',
    checkOut: '2026-11-22',
    noches: 3,
    cantidadHabitaciones: 1,
    huespedes: 2,
    precio: 9,
  },
} as unknown as KoiOpcion;

const err = (status: number | null, codigo: string | null) => ({
  ok: false as const,
  error: { status, codigo, mensaje: '' },
});

const armar = (sobre: Partial<DepsCarrito> = {}, conVuelo = true) => {
  const orden: string[] = [];
  const deps: DepsCarrito = {
    recargar: vi.fn(async () => void orden.push('recargar')),
    leer: () => ({ carrito: conVuelo ? ({ vuelo: {} } as never) : null, error: null }),
    agregarEstadia: vi.fn(async () => {
      orden.push('estadia');
      return { ok: true as const };
    }),
    quitarVuelo: vi.fn(async () => {
      orden.push('quitar');
      return { ok: true as const };
    }),
    ...sobre,
  };
  return { deps, orden };
};
const marca = (): EstadiaAgregada => ({ clave: null });

describe('ejecutarFlujoCarrito', () => {
  it('pide confirmar el reemplazo sin agregar nada', async () => {
    const { deps } = armar();
    const s = await ejecutarFlujoCarrito(opcion, 'TODO', false, deps, marca());
    expect(s.tipo).toBe('confirmarReemplazo');
    expect(deps.agregarEstadia).not.toHaveBeenCalled();
    expect(deps.quitarVuelo).not.toHaveBeenCalled();
  });

  it('al reemplazar agrega la estadía primero, después quita el vuelo y va a los asientos', async () => {
    const { deps, orden } = armar();
    const s = await ejecutarFlujoCarrito(opcion, 'TODO', true, deps, marca());
    expect(orden).toEqual(['estadia', 'quitar']);
    expect(s.tipo).toBe('asientos');
  });

  it('si la estadía falla no toca el vuelo', async () => {
    const { deps } = armar({ agregarEstadia: vi.fn(async () => err(409, 'SIN_DISPONIBILIDAD_HOTEL')) });
    const s = await ejecutarFlujoCarrito(opcion, 'TODO', true, deps, marca());
    expect(s).toMatchObject({ tipo: 'error' });
    expect(deps.quitarVuelo).not.toHaveBeenCalled();
  });

  it('si quitar el vuelo falla tras agregar el hotel avisa y el reintento no duplica la estadía', async () => {
    let falla = true;
    const { deps } = armar({
      quitarVuelo: vi.fn(async () => (falla ? err(500, null) : { ok: true as const })),
    });
    const m = marca();
    const s1 = await ejecutarFlujoCarrito(opcion, 'TODO', true, deps, m);
    expect(s1).toEqual({ tipo: 'error', texto: MENSAJE_HOTEL_SIN_QUITAR_VUELO });
    falla = false;
    const s2 = await ejecutarFlujoCarrito(opcion, 'TODO', true, deps, m);
    expect(s2.tipo).toBe('asientos');
    expect(deps.agregarEstadia).toHaveBeenCalledTimes(1);
  });

  it('si el vuelo ya no está al quitarlo, sigue', async () => {
    const { deps } = armar({ quitarVuelo: vi.fn(async () => err(404, 'SIN_VUELO')) });
    const s = await ejecutarFlujoCarrito(opcion, 'TODO', true, deps, marca());
    expect(s.tipo).toBe('asientos');
  });

  it('solo hotel agrega y avisa', async () => {
    const { deps } = armar();
    const s = await ejecutarFlujoCarrito(opcion, 'SOLO_HOTEL', false, deps, marca());
    expect(s.tipo).toBe('agregado');
    expect(deps.recargar).not.toHaveBeenCalled();
  });

  it('descarta lo que llega tras cambiar la sesión', async () => {
    const { deps } = armar({ agregarEstadia: vi.fn(async () => err(null, 'SESION_CAMBIADA')) });
    const s = await ejecutarFlujoCarrito(opcion, 'SOLO_HOTEL', false, deps, marca());
    expect(s.tipo).toBe('descartado');
  });

  it('con error al consultar el carrito no sigue', async () => {
    const { deps } = armar({ leer: () => ({ carrito: null, error: 'x' }) });
    const s = await ejecutarFlujoCarrito(opcion, 'SOLO_VUELO', false, deps, marca());
    expect(s.tipo).toBe('error');
  });
});

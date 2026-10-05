import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Carrito } from '@/features/cart/cart.types';
import * as carritoService from '@/features/cart/services/carritoService';
import { useCarritoStore } from './useCarritoStore';

vi.mock('@/features/cart/services/carritoService', () => ({
  obtenerCarrito: vi.fn(),
  agregarEstadia: vi.fn(),
  quitarEstadia: vi.fn(),
  quitarVuelo: vi.fn(),
  cargarTitulares: vi.fn(),
}));

const carritoDe = (idCarrito: number): Carrito => ({
  idCarrito,
  creadorId: idCarrito,
  estadoGeneral: 'INICIADA',
  segundosRestantes: 600,
  montoTotal: 1000,
  moneda: 'ARS',
  cantidadItems: 1,
  datosCompletos: false,
  vuelo: null,
  estadias: [],
  asientos: [],
});

/** Promesa que se resuelve desde el test, para simular una respuesta lenta. */
const diferida = <T>() => {
  let resolver!: (v: T) => void;
  const promesa = new Promise<T>((r) => (resolver = r));
  return { promesa, resolver };
};

describe('useCarritoStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useCarritoStore.getState().limpiar();
  });

  it('recargar guarda el carrito recibido', async () => {
    vi.mocked(carritoService.obtenerCarrito).mockResolvedValue(carritoDe(1));
    await useCarritoStore.getState().recargar();
    const s = useCarritoStore.getState();
    expect(s.carrito?.idCarrito).toBe(1);
    expect(s.cargado).toBe(true);
    expect(s.cargando).toBe(false);
  });

  it('descarta la respuesta de un GET que termina después de limpiar (cierre de sesión)', async () => {
    const lenta = diferida<Carrito | null>();
    vi.mocked(carritoService.obtenerCarrito).mockReturnValueOnce(lenta.promesa);
    const pedido = useCarritoStore.getState().recargar();
    useCarritoStore.getState().limpiar();
    lenta.resolver(carritoDe(1));
    await pedido;
    const s = useCarritoStore.getState();
    expect(s.carrito).toBeNull();
    expect(s.cargado).toBe(false);
    expect(s.cargando).toBe(false);
  });

  it('el carrito de otro usuario no pisa al nuevo aunque llegue después', async () => {
    const deA = diferida<Carrito | null>();
    vi.mocked(carritoService.obtenerCarrito)
      .mockReturnValueOnce(deA.promesa)
      .mockResolvedValueOnce(carritoDe(2));
    const pedidoA = useCarritoStore.getState().recargar();
    useCarritoStore.getState().limpiar();
    await useCarritoStore.getState().recargar();
    deA.resolver(carritoDe(1));
    await pedidoA;
    expect(useCarritoStore.getState().carrito?.idCarrito).toBe(2);
  });

  it('descarta el error de un GET viejo', async () => {
    const lenta = diferida<Carrito | null>();
    vi.mocked(carritoService.obtenerCarrito).mockReturnValueOnce(
      lenta.promesa.then(() => Promise.reject(new Error('red'))),
    );
    const pedido = useCarritoStore.getState().recargar();
    useCarritoStore.getState().limpiar();
    lenta.resolver(null);
    await pedido;
    expect(useCarritoStore.getState().error).toBeNull();
  });

  it('una acción que termina después de limpiar no guarda el carrito', async () => {
    const lenta = diferida<Carrito | null>();
    vi.mocked(carritoService.quitarVuelo).mockReturnValueOnce(lenta.promesa);
    const accion = useCarritoStore.getState().quitarVuelo();
    useCarritoStore.getState().limpiar();
    lenta.resolver(carritoDe(1));
    const r = await accion;
    expect(r.ok).toBe(false);
    expect(useCarritoStore.getState().carrito).toBeNull();
  });
});

import { useState, type FormEvent, type ReactNode } from 'react';
import { Link } from 'react-router';
import { useCarritoStore } from '@/store/useCarritoStore';
import { useFlightStore } from '@/store/useFlightStore';
import { cn } from '@/utils/cn';
import type { Carrito, PasajeroInput, VueloCarrito } from '../cart.types';
import {
  armarPasajeros,
  estadoAsientos,
  leerErrorApi,
  pasajerosIniciales,
  validarPasajero,
} from '../carrito';
import { cargarPasajeros } from '../services/carritoService';
import { BOTON_BORDE, BOTON_LLENO, CARD, FOCO } from './estilos';

export const inputClass =
  'focus:border-secondary focus:ring-secondary/20 h-11 w-full rounded-xl border border-[#E2E8F0] bg-white px-3 text-secondary outline-none focus:ring-2 aria-invalid:border-alert';

type Errores = Partial<Record<keyof PasajeroInput, string>>;

const Aviso = ({ children }: { children: ReactNode }) => (
  <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
    {children}
  </p>
);

/** Estado "listo" de un formulario: check verde y botón para cambiar. */
export const DatosCargados = ({
  texto,
  accion,
  onCambiar,
}: {
  texto: string;
  accion: string;
  onCambiar?: () => void;
}) => (
  <section
    className={cn('flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between', CARD)}
  >
    <div className="flex items-center gap-2">
      <span aria-hidden className="material-symbols-outlined text-success">
        check_circle
      </span>
      <p className="text-secondary font-semibold">{texto}</p>
    </div>
    {onCambiar && (
      <button type="button" className={cn(BOTON_BORDE, FOCO)} onClick={onCambiar}>
        <span aria-hidden className="material-symbols-outlined text-[20px]">
          edit
        </span>
        {accion}
      </button>
    )}
  </section>
);

/**
 * Datos de los pasajeros (D26: antes en Booking.tsx). Asientos de useFlightStore, en orden.
 * Un PUT repetido reemplaza los pasajeros, así que una vez cargados se pueden cambiar.
 */
export const PasajerosForm = ({ carrito, vuelo }: { carrito: Carrito; vuelo: VueloCarrito }) => {
  const vueloElegido = useFlightStore((s) => s.selectedDepartureFlight);
  const asientos = useFlightStore((s) => s.selectedSeats);
  const recargar = useCarritoStore((s) => s.recargar);
  const [form, setForm] = useState<PasajeroInput[]>(() => pasajerosIniciales(carrito));
  const [editando, setEditando] = useState(false);
  const [errores, setErrores] = useState<Errores[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<{ mensaje: string; elegirAsientos: boolean } | null>(null);

  const estado = estadoAsientos(vuelo, vueloElegido, asientos);

  const cambiar = (i: number, campo: keyof PasajeroInput, valor: string) =>
    setForm((actual) => actual.map((p, j) => (j === i ? { ...p, [campo]: valor } : p)));

  const enviar = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (enviando) return;
    setError(null);
    const nuevos = form.map(validarPasajero);
    setErrores(nuevos);
    if (nuevos.some((e) => Object.keys(e).length > 0)) return;
    const pedido = armarPasajeros(form, asientos, vuelo);
    if (!pedido) {
      setError({ mensaje: 'Elegí un asiento para cada pasajero.', elegirAsientos: true });
      return;
    }
    setEnviando(true);
    try {
      await cargarPasajeros(carrito.idCarrito, pedido);
      setEditando(false);
      await recargar();
    } catch (err: unknown) {
      const e = leerErrorApi(err, 'No pudimos guardar los pasajeros.');
      setError({ mensaje: e.mensaje, elegirAsientos: e.codigo === 'ASIENTO_NO_BLOQUEADO' });
      if (e.status === 410) await recargar();
    } finally {
      setEnviando(false);
    }
  };

  if (vuelo.pasajerosCargados && !editando) {
    return (
      <DatosCargados
        texto="Datos de los pasajeros cargados"
        accion="Cambiar pasajeros"
        onCambiar={estado === 'ok' ? () => setEditando(true) : undefined}
      />
    );
  }

  return (
    <section className={cn('flex flex-col gap-4', CARD)}>
      <div className="flex flex-col gap-1">
        <h2 className="text-secondary text-lg font-bold">Datos de los pasajeros</h2>
        <p className="text-secondary/60 text-sm">
          Tal como figuran en el documento con el que van a viajar.
        </p>
      </div>
      {estado === 'otroVuelo' ? (
        <Aviso>
          No encontramos los asientos que elegiste para este vuelo. Quitá el vuelo del carrito y
          volvé a buscarlo para elegir asientos.
        </Aviso>
      ) : (
        <form onSubmit={enviar} noValidate className="flex flex-col gap-4">
          {form.map((p, i) => (
            <fieldset
              key={i}
              className="flex min-w-0 flex-col gap-3 rounded-xl border border-[#E2E8F0] p-4"
            >
              <legend className="text-secondary px-1 font-semibold">Pasajero {i + 1}</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-secondary flex flex-col gap-1 text-sm font-medium">
                  Nombre completo
                  <input
                    autoComplete={i === 0 ? 'name' : 'off'}
                    value={p.nombreCompleto}
                    maxLength={100}
                    onChange={(e) => cambiar(i, 'nombreCompleto', e.target.value)}
                    aria-invalid={Boolean(errores[i]?.nombreCompleto)}
                    className={inputClass}
                  />
                  {errores[i]?.nombreCompleto && (
                    <span className="text-alert text-xs">{errores[i].nombreCompleto}</span>
                  )}
                </label>
                <label className="text-secondary flex flex-col gap-1 text-sm font-medium">
                  DNI o pasaporte
                  <input
                    value={p.dniPasaporte}
                    maxLength={20}
                    onChange={(e) => cambiar(i, 'dniPasaporte', e.target.value)}
                    aria-invalid={Boolean(errores[i]?.dniPasaporte)}
                    className={inputClass}
                  />
                  {errores[i]?.dniPasaporte && (
                    <span className="text-alert text-xs">{errores[i].dniPasaporte}</span>
                  )}
                </label>
              </div>
            </fieldset>
          ))}
          {estado === 'faltan' && (
            <Aviso>
              Tenés {asientos.length} de {vuelo.cantidadPasajeros} asientos elegidos.{' '}
              <Link to="/booking/seats" className="font-bold underline">
                Elegir asientos
              </Link>
            </Aviso>
          )}
          {error && (
            <Aviso>
              {error.mensaje}{' '}
              {error.elegirAsientos && (
                <Link to="/booking/seats" className="font-bold underline">
                  Volver a elegir asientos
                </Link>
              )}
            </Aviso>
          )}
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="submit"
              className={cn(BOTON_LLENO, FOCO)}
              disabled={enviando || estado !== 'ok'}
              aria-busy={enviando}
            >
              {enviando ? 'Guardando...' : 'Guardar pasajeros'}
            </button>
            {editando && (
              <button
                type="button"
                className={cn(BOTON_BORDE, 'min-h-12', FOCO)}
                onClick={() => setEditando(false)}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      )}
    </section>
  );
};

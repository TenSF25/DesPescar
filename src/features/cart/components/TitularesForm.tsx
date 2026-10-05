import { useState, type FormEvent } from 'react';
import { useCarritoStore } from '@/store/useCarritoStore';
import { cn } from '@/utils/cn';
import type { Carrito, EstadiaCarrito, TitularInput } from '../cart.types';
import { armarTitulares, estadiasActivas, validarTitular } from '../carrito';
import { BOTON_BORDE, BOTON_LLENO, CARD, FOCO } from './estilos';
import { DatosCargados, inputClass } from './PasajerosForm';

type Errores = Partial<Record<keyof TitularInput, string>>;

const inicial = (e: EstadiaCarrito): TitularInput => ({
  nombre: e.titularNombre ?? '',
  dni: e.titularDni ?? '',
  telefono: e.titularTelefono ?? '',
});

const CAMPOS: {
  campo: keyof TitularInput;
  label: string;
  tipo: string;
  auto: string;
  max: number;
}[] = [
  { campo: 'nombre', label: 'Nombre y apellido', tipo: 'text', auto: 'name', max: 100 },
  { campo: 'dni', label: 'DNI o pasaporte', tipo: 'text', auto: 'off', max: 20 },
  { campo: 'telefono', label: 'Teléfono', tipo: 'tel', auto: 'tel', max: 30 },
];

/** Titular de cada estadía activa: quien hace el check-in. */
export const TitularesForm = ({ carrito }: { carrito: Carrito }) => {
  const estadias = estadiasActivas(carrito);
  const faltan = estadias.some((e) => !e.titularNombre);
  const cargarTitulares = useCarritoStore((s) => s.cargarTitulares);
  const recargar = useCarritoStore((s) => s.recargar);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState<Record<number, TitularInput>>({});
  const [errores, setErrores] = useState<Record<number, Errores>>({});
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (estadias.length === 0) return null;
  const valor = (e: EstadiaCarrito) => form[e.id] ?? inicial(e);

  if (!faltan && !editando) {
    return (
      <DatosCargados
        texto="Titulares de las estadías cargados"
        accion="Cambiar titulares"
        onCambiar={() => setEditando(true)}
      />
    );
  }

  const cambiar = (e: EstadiaCarrito, campo: keyof TitularInput, v: string) =>
    setForm((actual) => ({ ...actual, [e.id]: { ...(actual[e.id] ?? inicial(e)), [campo]: v } }));

  const copiarPrimero = () => {
    const primero = valor(estadias[0]);
    setForm(Object.fromEntries(estadias.map((e) => [e.id, { ...primero }])));
  };

  const enviar = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (enviando) return;
    setError(null);
    const completos = Object.fromEntries(estadias.map((e) => [e.id, valor(e)]));
    const nuevos = Object.fromEntries(estadias.map((e) => [e.id, validarTitular(completos[e.id])]));
    setErrores(nuevos);
    if (Object.values(nuevos).some((e) => Object.keys(e).length > 0)) return;
    setEnviando(true);
    const r = await cargarTitulares(armarTitulares(carrito, completos));
    setEnviando(false);
    if (r.ok) {
      setEditando(false);
      setForm({});
    } else {
      setError(r.error.mensaje);
      if (r.error.status === 410) await recargar();
    }
  };

  return (
    <section className={cn('flex flex-col gap-4', CARD)}>
      <div className="flex flex-col gap-1">
        <h2 className="text-secondary text-lg font-bold">Titulares de las estadías</h2>
        <p className="text-secondary/60 text-sm">
          Es la persona que hace el check-in. El hotel le va a pedir el documento.
        </p>
      </div>
      <form onSubmit={enviar} noValidate className="flex flex-col gap-4">
        {estadias.map((e, i) => (
          <fieldset
            key={e.id}
            className="flex min-w-0 flex-col gap-3 rounded-xl border border-[#E2E8F0] p-4"
          >
            <legend className="text-secondary px-1 font-semibold">
              {e.hotelNombre} · {e.tipoHabitacionNombre}
            </legend>
            <div className="grid gap-3 sm:grid-cols-3">
              {CAMPOS.map(({ campo, label, tipo, auto, max }) => (
                <label
                  key={campo}
                  className="text-secondary flex flex-col gap-1 text-sm font-medium"
                >
                  {label}
                  <input
                    type={tipo}
                    autoComplete={i === 0 ? auto : 'off'}
                    maxLength={max}
                    value={valor(e)[campo]}
                    onChange={(ev) => cambiar(e, campo, ev.target.value)}
                    aria-invalid={Boolean(errores[e.id]?.[campo])}
                    placeholder={campo === 'telefono' ? '+54 11 5555-5555' : undefined}
                    className={inputClass}
                  />
                  {errores[e.id]?.[campo] && (
                    <span className="text-alert text-xs">{errores[e.id][campo]}</span>
                  )}
                </label>
              ))}
            </div>
            {i === 0 && estadias.length > 1 && (
              <button
                type="button"
                onClick={copiarPrimero}
                className={cn(
                  'text-secondary min-h-10 w-fit rounded-lg text-sm font-semibold underline underline-offset-4',
                  FOCO,
                )}
              >
                Usar estos datos en todas las estadías
              </button>
            )}
          </fieldset>
        ))}
        {error && (
          <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="submit"
            className={cn(BOTON_LLENO, FOCO)}
            disabled={enviando}
            aria-busy={enviando}
          >
            {enviando ? 'Guardando...' : 'Guardar titulares'}
          </button>
          {editando && !faltan && (
            <button
              type="button"
              className={cn(BOTON_BORDE, 'min-h-12', FOCO)}
              onClick={() => {
                setEditando(false);
                setForm({});
                setErrores({});
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </section>
  );
};

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageHeader, Badge, Select } from '../../../components/admin';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { formatCurrency } from '../../../utils/formatCurrency';
import { useHotelDetail } from '../../hotels/hooks/useHotelDetail';
import { TIPOS_HOTEL } from '../../hotels/hooks/useHotelFilters';

interface FormularioHotel {
  nombre: string;
  ciudad: string;
  pais: string;
  tipo: string;
  estrellas: number;
  precioPorNoche: number;
  activo: boolean;
}

/** Interruptor simple (on/off), no viene en el kit de admin todavía. */
const Toggle = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
      checked ? 'bg-primary' : 'bg-black/20'
    }`}
  >
    <span
      className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
        checked ? 'translate-x-5' : ''
      }`}
    />
  </button>
);

export const AdminHotelEditPage = () => {
  const navigate = useNavigate();
  const { hotel, loading, notFound } = useHotelDetail();

  const [form, setForm] = useState<FormularioHotel | null>(null);
  const [disponibilidad, setDisponibilidad] = useState<Record<number, boolean>>({});
  const [guardado, setGuardado] = useState(false);

  // Cuando llega el hotel (fetch asíncrono), inicializamos el formulario editable.
  useEffect(() => {
    if (hotel) {
      setForm({
        nombre: hotel.nombre,
        ciudad: hotel.ciudad,
        pais: hotel.pais,
        tipo: hotel.tipo,
        estrellas: hotel.estrellas,
        precioPorNoche: hotel.precioPorNoche,
        activo: hotel.activo !== false,
      });
      setDisponibilidad(
        Object.fromEntries((hotel.habitaciones ?? []).map((h) => [h.id, true])),
      );
    }
  }, [hotel]);

  if (loading || !form) {
    return <p className="p-6">Cargando...</p>;
  }

  if (notFound || !hotel) {
    return (
      <div className="flex flex-col items-center gap-4 p-10 text-center">
        <p className="text-[#44474E]">No encontramos este hotel.</p>
        <Link to="/admin/hoteles" className="text-primary font-semibold underline">
          Volver a Gestión de Hoteles
        </Link>
      </div>
    );
  }

  const actualizar = <K extends keyof FormularioHotel>(campo: K, valor: FormularioHotel[K]) => {
    setForm((prev) => (prev ? { ...prev, [campo]: valor } : prev));
    setGuardado(false);
  };

  const guardarCambios = () => {
    // Sin backend todavía: simula el guardado en la UI, no persiste en ningún lado.
    // Cuando exista la API, este es el punto para el PUT/PATCH real.
    setGuardado(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/admin/hoteles"
        className="flex w-max items-center gap-1 text-sm text-[#44474E] hover:text-secondary"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Volver a Gestión de Hoteles
      </Link>

      <PageHeader
        title={hotel.nombre}
        description="Editá la información y disponibilidad de este hotel."
        actions={<Badge tone={form.activo ? 'success' : 'danger'}>{form.activo ? 'Activo' : 'Inactivo'}</Badge>}
      />

      {/* Información general */}
      <div className="flex flex-col gap-4 rounded-2xl border border-black/10 bg-white p-5">
        <h2 className="text-secondary font-semibold">Información general</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            contentLabel="Nombre"
            value={form.nombre}
            onChange={(e) => actualizar('nombre', e.target.value)}
          />
          <Input
            contentLabel="Ciudad"
            value={form.ciudad}
            onChange={(e) => actualizar('ciudad', e.target.value)}
          />
          <Input
            contentLabel="País"
            value={form.pais}
            onChange={(e) => actualizar('pais', e.target.value)}
          />
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-[#1A2B4C]">Tipo</label>
            <Select value={form.tipo} onChange={(e) => actualizar('tipo', e.target.value)}>
              {TIPOS_HOTEL.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-[#1A2B4C]">Estrellas</label>
            <Select
              value={form.estrellas}
              onChange={(e) => actualizar('estrellas', Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} estrella{n > 1 ? 's' : ''}
                </option>
              ))}
            </Select>
          </div>
          <Input
            contentLabel="Precio por noche (USD)"
            type="number"
            min={0}
            value={form.precioPorNoche}
            onChange={(e) => actualizar('precioPorNoche', Number(e.target.value))}
          />
          <div className="flex items-center justify-between rounded-xl border border-black/10 px-4 py-2.5 sm:col-span-2">
            <span className="font-semibold text-[#1A2B4C]">Hotel activo en la plataforma</span>
            <Toggle checked={form.activo} onChange={(v) => actualizar('activo', v)} />
          </div>
        </div>
      </div>

      {/* Habitaciones y disponibilidad */}
      {hotel.habitaciones && hotel.habitaciones.length > 0 && (
        <div className="flex flex-col gap-4 rounded-2xl border border-black/10 bg-white p-5">
          <h2 className="text-secondary font-semibold">Habitaciones y disponibilidad</h2>
          <div className="flex flex-col divide-y divide-black/10">
            {hotel.habitaciones.map((hab) => (
              <div key={hab.id} className="flex items-center gap-4 py-3">
                <img
                  src={hab.imageUrl}
                  alt={hab.nombre}
                  className="h-12 w-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="text-secondary font-semibold">{hab.nombre}</p>
                  <p className="text-sm text-[#44474E]">
                    {formatCurrency(hab.precioPorNoche)} / noche · Capacidad: {hab.capacidad}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-[#44474E]">
                    {disponibilidad[hab.id] ? 'Disponible' : 'No disponible'}
                  </span>
                  <Toggle
                    checked={disponibilidad[hab.id] ?? true}
                    onChange={(v) => {
                      setDisponibilidad((prev) => ({ ...prev, [hab.id]: v }));
                      setGuardado(false);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#44474E]">
            Nota: la disponibilidad de habitaciones todavía no se guarda en ningún lado — es
            solo una simulación visual hasta que se conecte con el backend real.
          </p>
        </div>
      )}

      {/* Guardar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {guardado && (
          <p className="flex items-center gap-1 text-sm font-semibold text-green-700">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            Cambios guardados (simulado, sin backend todavía)
          </p>
        )}
        <div className="flex gap-3 sm:ml-auto">
          <Button variant="secondary" onClick={() => navigate('/admin/hoteles')}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            className="bg-primary text-white"
            onClick={guardarCambios}
          >
            Guardar cambios
          </Button>
        </div>
      </div>
    </div>
  );
};

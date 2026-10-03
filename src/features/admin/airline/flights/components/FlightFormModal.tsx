import { useState, type ChangeEvent, type FormEvent } from 'react';
import { AdminInput as Input, Modal, Select } from '@/components/admin';
import { Button } from '@/components/ui/Button';
import type { AdminFlight, FlightInput, FlightStatus } from '../admin-flights.types';

interface FlightFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: FlightInput) => void;
  isSaving?: boolean;
  /** Si se pasa, el modal edita ese vuelo; si no, crea uno nuevo. */
  flight?: AdminFlight | null;
}

const ESTADOS: FlightStatus[] = ['Programado', 'En curso', 'Completado', 'Cancelado'];

const emptyForm: FlightInput = {
  numero: '',
  origen: '',
  destino: '',
  fecha: '',
  hora: '',
  precioProm: 0,
};

const toForm = (flight?: AdminFlight | null): FlightInput =>
  flight
    ? {
        numero: flight.numero,
        origen: flight.origen,
        destino: flight.destino,
        fecha: flight.fecha,
        hora: flight.hora,
        precioProm: flight.precioProm,
        estado: flight.estado,
      }
    : emptyForm;

/**
 * Formulario de vuelo en un modal, para alta y edición. El padre debe pasarle un
 * `key` distinto por vuelo (ej: `flight?.id ?? 'new'`) para que el formulario
 * arranque con los datos correctos.
 */
export const FlightFormModal = ({
  open,
  onClose,
  onSubmit,
  isSaving = false,
  flight,
}: FlightFormModalProps) => {
  const isEditing = !!flight;
  const [form, setForm] = useState<FlightInput>(() => toForm(flight));

  const sameRoute = form.origen !== '' && form.origen === form.destino;

  const handleChange = (field: keyof FlightInput) => (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const value =
      field === 'precioProm'
        ? Number(raw)
        : field === 'origen' || field === 'destino'
          ? raw.toUpperCase()
          : raw;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (sameRoute) return;
    onSubmit(form);
    if (!isEditing) setForm(emptyForm);
  };

  const handleClose = () => {
    setForm(toForm(flight));
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEditing ? `Editar vuelo ${flight.numero}` : 'Agregar nuevo vuelo'}
      description={
        isEditing
          ? 'Modifica los datos del vuelo. Los cambios se reflejan en el cronograma.'
          : 'Carga un vuelo para publicarlo en el cronograma de vuelos.'
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          contentLabel="Número de vuelo"
          placeholder="Ej: DSC4521"
          value={form.numero}
          onChange={handleChange('numero')}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            contentLabel="Origen (IATA)"
            placeholder="Ej: MAD"
            value={form.origen}
            onChange={handleChange('origen')}
            maxLength={3}
            minLength={3}
            required
          />
          <Input
            contentLabel="Destino (IATA)"
            placeholder="Ej: MEX"
            value={form.destino}
            onChange={handleChange('destino')}
            maxLength={3}
            minLength={3}
            required
          />
        </div>
        {sameRoute && (
          <p className="text-alert -mt-2 text-xs font-semibold">
            El origen y el destino no pueden ser el mismo aeropuerto.
          </p>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Input
            contentLabel="Fecha"
            type="date"
            value={form.fecha}
            onChange={handleChange('fecha')}
            required
          />
          <Input
            contentLabel="Hora"
            type="time"
            value={form.hora}
            onChange={handleChange('hora')}
            required
          />
        </div>

        <Input
          contentLabel="Precio promedio (USD)"
          type="number"
          min={0}
          value={form.precioProm || ''}
          onChange={handleChange('precioProm')}
          required
        />

        {isEditing && (
          <div className="flex flex-col gap-2">
            <span className="font-semibold text-[#1A2B4C]">Estado</span>
            <Select
              value={form.estado}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, estado: e.target.value as FlightStatus }))
              }
            >
              {ESTADOS.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </Select>
          </div>
        )}

        <div className="mt-2 flex gap-3">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isSaving || sameRoute}>
            {isSaving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Guardar vuelo'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

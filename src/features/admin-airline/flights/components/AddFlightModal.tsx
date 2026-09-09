import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Modal } from '../../../../components/admin';
import { Input } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/Button';
import type { NewFlightInput } from '../admin-flights.types';

interface AddFlightModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: NewFlightInput) => void;
  isSaving?: boolean;
}

const emptyForm: NewFlightInput = {
  numero: '',
  origen: '',
  destino: '',
  fecha: '',
  hora: '',
  precioProm: 0,
};

export const AddFlightModal = ({ open, onClose, onSubmit, isSaving = false }: AddFlightModalProps) => {
  const [form, setForm] = useState<NewFlightInput>(emptyForm);

  const handleChange = (field: keyof NewFlightInput) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = field === 'precioProm' ? Number(e.target.value) : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    setForm(emptyForm);
  };

  const handleClose = () => {
    setForm(emptyForm);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Agregar nuevo vuelo"
      description="Carga un vuelo para publicarlo en el cronograma de vuelos."
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
            required
          />
          <Input
            contentLabel="Destino (IATA)"
            placeholder="Ej: MEX"
            value={form.destino}
            onChange={handleChange('destino')}
            required
          />
        </div>

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

        <div className="mt-2 flex gap-3">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isSaving}>
            {isSaving ? 'Guardando...' : 'Guardar vuelo'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

import { Card, SelectField, TextField } from '@/features/profile/components/FormParts';
import { NACIONALIDADES } from '@/utils/countries';
import {
  GENEROS,
  TIPOS_DOCUMENTO,
  type FieldErrors,
  type PassengerData,
  type TipoDocumento,
} from '../../checkout.types';

interface PassengerFormProps {
  index: number;
  passenger: PassengerData;
  errors: FieldErrors;
  /** Asiento asignado a este pasajero (ej: "12A"), si ya se conoce. */
  seat?: string;
  /** Los datos se precargaron desde el perfil de la cuenta. */
  fromProfile?: boolean;
  /** Datos ya guardados en la reserva: no se pueden modificar. */
  locked?: boolean;
  onChange: <K extends keyof PassengerData>(field: K, value: PassengerData[K]) => void;
}

const SELECCIONA = { value: '', label: 'Seleccioná…' };

export const PassengerForm = ({
  index,
  passenger,
  errors,
  seat,
  fromProfile,
  locked,
  onChange,
}: PassengerFormProps) => {
  const hoy = new Date().toISOString().split('T')[0];

  return (
    <Card title={`Pasajero ${index + 1}${index === 0 ? ' (quien compra)' : ''}`} icon="person">
      <div className="flex flex-wrap items-center gap-2 sm:col-span-2">
        {seat && (
          <span className="bg-secondary/10 text-secondary flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold">
            <span className="material-symbols-outlined text-[16px]!">
              airline_seat_recline_normal
            </span>
            Asiento {seat}
          </span>
        )}
        {fromProfile && (
          <span className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
            <span className="material-symbols-outlined text-[16px]!">account_circle</span>
            Datos de tu perfil
          </span>
        )}
        <p className="text-sm text-[#44474E]">
          {fromProfile
            ? 'Revisalos: tienen que coincidir con el documento con el que vas a viajar.'
            : 'Completá los datos tal como figuran en su documento.'}
        </p>
      </div>

      <TextField
        contentLabel="Nombre/s"
        autoComplete="off"
        value={passenger.nombre}
        error={errors.nombre}
        disabled={locked}
        onChange={(e) => onChange('nombre', e.target.value)}
      />
      <TextField
        contentLabel="Apellido/s"
        autoComplete="off"
        value={passenger.apellido}
        error={errors.apellido}
        disabled={locked}
        onChange={(e) => onChange('apellido', e.target.value)}
      />
      <SelectField
        label="Tipo de documento"
        value={passenger.tipoDocumento}
        options={TIPOS_DOCUMENTO.map((tipo) => ({ value: tipo, label: tipo }))}
        disabled={locked}
        onChange={(value) => onChange('tipoDocumento', value as TipoDocumento)}
      />
      <TextField
        contentLabel="Número de documento"
        autoComplete="off"
        inputMode={passenger.tipoDocumento === 'DNI' ? 'numeric' : 'text'}
        value={passenger.numeroDocumento}
        error={errors.numeroDocumento}
        disabled={locked}
        onChange={(e) => onChange('numeroDocumento', e.target.value)}
      />
      <TextField
        contentLabel="Fecha de nacimiento"
        type="date"
        max={hoy}
        value={passenger.fechaNacimiento}
        error={errors.fechaNacimiento}
        disabled={locked}
        onChange={(e) => onChange('fechaNacimiento', e.target.value)}
      />
      <SelectField
        label="Género (como figura en el documento)"
        value={passenger.genero}
        options={[SELECCIONA, ...GENEROS.map((genero) => ({ value: genero, label: genero }))]}
        error={errors.genero}
        disabled={locked}
        onChange={(value) => onChange('genero', value)}
      />
      <SelectField
        label="Nacionalidad"
        value={passenger.nacionalidad}
        options={[
          SELECCIONA,
          ...NACIONALIDADES.map((nacionalidad) => ({ value: nacionalidad, label: nacionalidad })),
        ]}
        error={errors.nacionalidad}
        disabled={locked}
        onChange={(value) => onChange('nacionalidad', value)}
      />
    </Card>
  );
};

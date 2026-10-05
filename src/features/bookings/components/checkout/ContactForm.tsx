import { Card, SelectField, TextField } from '@/features/profile/components/FormParts';
import { DEFAULT_DIAL_CODE, DIAL_CODES } from '@/utils/countries';
import {
  TIPOS_TELEFONO,
  type ContactData,
  type FieldErrors,
  type PhoneData,
  type TipoTelefono,
} from '../../checkout.types';

const MAX_PHONES = 3;

interface ContactFormProps {
  contact: ContactData;
  errors: FieldErrors;
  onChange: (contact: ContactData) => void;
  /** Quita el error de un campo al editarlo. */
  onTouch: (field: string) => void;
}

/** Dónde se envían los vouchers y a qué teléfonos contactar. */
export const ContactForm = ({ contact, errors, onChange, onTouch }: ContactFormProps) => {
  const updatePhone = (index: number, changes: Partial<PhoneData>, errorKey: string) => {
    onChange({
      ...contact,
      telefonos: contact.telefonos.map((tel, i) => (i === index ? { ...tel, ...changes } : tel)),
    });
    onTouch(errorKey);
  };

  return (
    <>
      <Card title="¿A dónde enviamos los vouchers?" icon="mail">
        <TextField
          contentLabel="Correo electrónico"
          type="email"
          autoComplete="off"
          value={contact.email}
          error={errors.email}
          onChange={(e) => {
            onChange({ ...contact, email: e.target.value });
            onTouch('email');
            onTouch('confirmEmail');
          }}
        />
        <TextField
          contentLabel="Confirmar correo electrónico"
          type="email"
          autoComplete="off"
          value={contact.confirmEmail}
          error={errors.confirmEmail}
          // No se permite pegar: repetir el correo a mano es lo que evita errores de tipeo.
          onPaste={(e) => e.preventDefault()}
          onChange={(e) => {
            onChange({ ...contact, confirmEmail: e.target.value });
            onTouch('confirmEmail');
          }}
        />
        <p className="text-sm text-[#44474E] sm:col-span-2">
          Te enviamos las confirmaciones y los vouchers de tu compra a este correo.
        </p>
      </Card>

      <Card title="¿A qué número contactarte?" icon="call">
        {contact.telefonos.map((tel, index) => (
          <div
            key={index}
            className="grid gap-4 sm:col-span-2 sm:grid-cols-[9rem_11rem_minmax(0,1fr)_auto] sm:items-start"
          >
            <SelectField
              label={index === 0 ? 'Tipo de teléfono' : `Teléfono ${index + 1}`}
              value={tel.tipo}
              options={TIPOS_TELEFONO.map((tipo) => ({ value: tipo, label: tipo }))}
              onChange={(value) => updatePhone(index, { tipo: value as TipoTelefono }, '')}
            />
            <SelectField
              label="Código de país"
              value={tel.codigo || DEFAULT_DIAL_CODE}
              options={DIAL_CODES.map(({ code, country }) => ({
                value: code,
                label: `${code} ${country}`,
              }))}
              error={errors[`telefono${index}-codigo`]}
              onChange={(value) => updatePhone(index, { codigo: value }, `telefono${index}-codigo`)}
            />
            <TextField
              contentLabel="Número (sin 0 ni 15)"
              type="tel"
              inputMode="numeric"
              autoComplete="off"
              placeholder="Ej: 1155551234"
              value={tel.numero}
              error={errors[`telefono${index}-numero`]}
              onChange={(e) =>
                updatePhone(index, { numero: e.target.value }, `telefono${index}-numero`)
              }
            />
            {index > 0 && (
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...contact,
                    telefonos: contact.telefonos.filter((_, i) => i !== index),
                  })
                }
                aria-label={`Quitar teléfono ${index + 1}`}
                className="text-alert hover:bg-alert/10 flex h-10 w-10 cursor-pointer items-center justify-center self-end rounded-xl"
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            )}
          </div>
        ))}

        {contact.telefonos.length < MAX_PHONES && (
          <button
            type="button"
            onClick={() =>
              onChange({
                ...contact,
                telefonos: [
                  ...contact.telefonos,
                  { tipo: 'Casa', codigo: DEFAULT_DIAL_CODE, numero: '' },
                ],
              })
            }
            className="text-secondary hover:bg-secondary/5 flex w-fit cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold sm:col-span-2"
          >
            <span className="material-symbols-outlined text-[20px]!">add_circle</span>
            Agregar otro teléfono
          </button>
        )}
      </Card>
    </>
  );
};

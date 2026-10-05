import { SelectField, TextField } from '@/features/profile/components/FormParts';
import { formatMoney } from '@/utils/formatCurrency';
import {
  BANCOS,
  BRAND_LABEL,
  CUOTAS,
  TIPOS_DOCUMENTO_TITULAR,
  type CardData,
  type TipoDocumentoTitular,
} from '../../card.types';
import { cvvLength, detectBrand, formatCardNumber, formatExpiry } from '../../card.validation';
import type { FieldErrors } from '../../checkout.types';

interface CardFormProps {
  card: CardData;
  errors: FieldErrors;
  /** Con tarjeta de crédito se ofrecen cuotas; con débito no. */
  credit: boolean;
  /** Total a pagar (para mostrar el valor de cada cuota). */
  total: number | null;
  currency?: string | null;
  onChange: <K extends keyof CardData>(field: K, value: CardData[K]) => void;
}

/** Datos de la tarjeta de crédito o de débito. No se guardan: viven solo en el estado de esta pantalla. */
export const CardForm = ({ card, errors, credit, total, currency, onChange }: CardFormProps) => {
  const brand = detectBrand(card.numero);
  const brandLabel = BRAND_LABEL[brand];

  return (
    <section
      aria-labelledby="card-form-title"
      className="grid gap-4 border-t border-black/10 pt-5 sm:col-span-2 sm:grid-cols-2"
    >
      <h3
        id="card-form-title"
        className="text-secondary flex items-center gap-2 text-base font-extrabold sm:col-span-2"
      >
        <span className="material-symbols-outlined text-primary text-[20px]!">credit_card</span>
        Ingresá los datos de la tarjeta
      </h3>

      <div className="sm:col-span-2">
        <TextField
          contentLabel={`Número de tarjeta${brandLabel ? ` · ${brandLabel}` : ''}`}
          inputMode="numeric"
          autoComplete="off"
          placeholder={brand === 'amex' ? '3712 345678 91234' : '1234 5678 9012 3456'}
          value={card.numero}
          error={errors.numero}
          onChange={(e) => onChange('numero', formatCardNumber(e.target.value))}
        />
      </div>

      <div className="sm:col-span-2">
        <TextField
          contentLabel="Nombre del titular (como figura en la tarjeta)"
          autoComplete="off"
          value={card.titular}
          error={errors.titular}
          onChange={(e) => onChange('titular', e.target.value.toUpperCase())}
        />
      </div>

      <TextField
        contentLabel="Vencimiento (MM/AA)"
        inputMode="numeric"
        autoComplete="off"
        placeholder="MM/AA"
        maxLength={5}
        value={card.vencimiento}
        error={errors.vencimiento}
        onChange={(e) => onChange('vencimiento', formatExpiry(e.target.value))}
      />
      <TextField
        contentLabel={`Código de seguridad${brand === 'amex' ? ' (4 dígitos, al frente)' : ' (3 dígitos, al dorso)'}`}
        type="password"
        inputMode="numeric"
        autoComplete="off"
        maxLength={cvvLength(brand)}
        value={card.cvv}
        error={errors.cvv}
        onChange={(e) => onChange('cvv', e.target.value.replace(/\D/g, ''))}
      />

      <SelectField
        label="Documento del titular"
        value={card.tipoDocumento}
        options={TIPOS_DOCUMENTO_TITULAR.map((tipo) => ({ value: tipo, label: tipo }))}
        onChange={(value) => onChange('tipoDocumento', value as TipoDocumentoTitular)}
      />
      <TextField
        contentLabel="Número de documento"
        inputMode="numeric"
        autoComplete="off"
        value={card.documento}
        error={errors.documento}
        onChange={(e) => onChange('documento', e.target.value)}
      />

      <div className={credit ? undefined : 'sm:col-span-2'}>
        <SelectField
          label="Banco emisor"
          value={card.banco}
          options={[
            { value: '', label: 'Seleccioná tu banco…' },
            ...BANCOS.map((banco) => ({ value: banco, label: banco })),
          ]}
          error={errors.banco}
          onChange={(value) => onChange('banco', value)}
        />
      </div>
      {credit && (
        <SelectField
          label="Cuotas"
          value={String(card.cuotas)}
          options={CUOTAS.map((cuotas) => ({
            value: String(cuotas),
            label:
              total === null
                ? `${cuotas} ${cuotas === 1 ? 'pago' : 'cuotas'}`
                : cuotas === 1
                  ? `1 pago de ${formatMoney(total, currency)}`
                  : `${cuotas} cuotas de ${formatMoney(total / cuotas, currency)}`,
          }))}
          error={errors.cuotas}
          onChange={(value) => onChange('cuotas', Number(value))}
        />
      )}

      <p className="flex items-start gap-2 text-sm text-gray-600 sm:col-span-2">
        <span className="material-symbols-outlined text-[18px]!">lock</span>
        <span>
          Por tu seguridad, no guardamos los datos de tu tarjeta.
          {credit && ' El costo financiero de las cuotas, si corresponde, lo informa tu banco.'}
        </span>
      </p>
    </section>
  );
};

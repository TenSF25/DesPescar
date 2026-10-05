import { cn } from '@/utils/cn';

const PAYMENT_METHODS = [
  {
    id: 'credit',
    label: 'Tarjeta de crédito',
    description: 'Visa, Mastercard, American Express y más. Podés pagar en cuotas.',
    icon: 'credit_card',
  },
  {
    id: 'debit',
    label: 'Tarjeta de débito',
    description: 'Visa Débito, Maestro y otras tarjetas de débito.',
    icon: 'payments',
  },
  {
    id: 'mercadopago',
    label: 'Mercado Pago',
    description: 'Pagá con el dinero de tu cuenta o con las tarjetas que ya guardaste.',
    icon: 'account_balance_wallet',
  },
] as const;

export type PaymentMethodId = (typeof PAYMENT_METHODS)[number]['id'];

interface PaymentMethodListProps {
  value: PaymentMethodId;
  onChange: (method: PaymentMethodId) => void;
}

/** Lista de medios de pago para elegir uno (radio). */
export const PaymentMethodList = ({ value, onChange }: PaymentMethodListProps) => (
  <div role="radiogroup" aria-label="Medio de pago" className="flex flex-col gap-3 sm:col-span-2">
    {PAYMENT_METHODS.map((method) => {
      const selected = value === method.id;

      return (
        <label
          key={method.id}
          className={cn(
            'flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors',
            selected
              ? 'border-secondary bg-secondary/5'
              : 'border-black/15 bg-white hover:border-black/30',
          )}
        >
          <input
            type="radio"
            name="payment-method"
            value={method.id}
            checked={selected}
            onChange={() => onChange(method.id)}
            className="accent-secondary h-4 w-4 shrink-0 cursor-pointer"
          />
          <span
            className={cn(
              'material-symbols-outlined shrink-0',
              selected ? 'text-secondary' : 'text-gray-500',
            )}
          >
            {method.icon}
          </span>
          <span className="flex flex-col">
            <span className="text-secondary font-bold">{method.label}</span>
            <span className="text-sm text-gray-600">{method.description}</span>
          </span>
        </label>
      );
    })}

    <p className="flex items-center gap-2 text-sm text-gray-600">
      <span className="material-symbols-outlined text-[18px]!">lock</span>
      Para terminar te llevamos a Mercado Pago, donde completás el pago de forma segura.
    </p>
  </div>
);

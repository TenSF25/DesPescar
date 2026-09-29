import { ChartCard, Select } from '../../../components/admin';
import { Input } from '../../../components/ui/Input';
import { Notice } from '../../../components/ui/Notice';
import { SaveRow } from './SaveRow';
import type {
  CompanyData,
  FieldErrors,
  SaveStatus,
  TaxCondition,
} from '../admin-settings.types';

interface CompanySectionProps {
  company: CompanyData;
  errors: FieldErrors<CompanyData>;
  status: SaveStatus;
  onChange: (campo: keyof CompanyData, valor: string) => void;
  onSave: () => void;
  /**
   * Si es false, la sección se muestra bloqueada (gris y sin guardar).
   * Los datos fiscales los carga el admin general al dar de alta la
   * empresa; el administrador de la empresa los consulta pero no los
   * edita, por un tema de veracidad y control.
   */
  editable: boolean;
}

const CONDICIONES_IVA: TaxCondition[] = ['Responsable Inscripto', 'Monotributo', 'Exento'];

/** Gris y sin cursor cuando la sección está bloqueada. */
const bloqueado = 'disabled:bg-black/5 disabled:text-[#44474E] disabled:cursor-not-allowed';

/**
 * Datos fiscales de la empresa proveedora.
 *
 * Los campos son genéricos a propósito: sirven igual para una aerolínea que
 * para un hospedaje. Lo único que distingue a uno del otro es
 * `tipoProveedor`, que nunca se edita porque lo determina el alta.
 */
export const CompanySection = ({
  company,
  errors,
  status,
  onChange,
  onSave,
  editable,
}: CompanySectionProps) => {
  return (
    <ChartCard
      title="Datos de la empresa"
      action={
        !editable && (
          <span className="flex flex-row items-center gap-1.5 rounded-full bg-black/5 px-3 py-1 text-[12px] font-semibold text-[#44474E]">
            <span className="material-symbols-outlined text-[16px]!" aria-hidden="true">
              lock
            </span>
            Solo lectura
          </span>
        )
      }
    >
      <div className="flex flex-col gap-5">
        {!editable && (
          <Notice variant="info" icon="info">
            Estos datos los carga el administrador general cuando da de alta la empresa. Si algo
            no es correcto, escribile a soporte para que lo corrija.
          </Notice>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            contentLabel="Razón social"
            value={company.razonSocial}
            error={errors.razonSocial}
            disabled={!editable}
            className={bloqueado}
            onChange={(event) => onChange('razonSocial', event.target.value)}
          />
          <Input
            contentLabel="CUIT"
            value={company.cuit}
            error={errors.cuit}
            placeholder="30-12345678-9"
            inputMode="numeric"
            disabled={!editable}
            className={bloqueado}
            onChange={(event) => onChange('cuit', event.target.value)}
          />
          <Input
            contentLabel="Nombre comercial"
            value={company.nombreComercial}
            error={errors.nombreComercial}
            disabled={!editable}
            className={bloqueado}
            onChange={(event) => onChange('nombreComercial', event.target.value)}
          />

          <div className="flex w-full flex-col gap-2">
            <label htmlFor="condicionIva" className="font-semibold text-[#1A2B4C]">
              Condición ante IVA
            </label>
            <Select
              id="condicionIva"
              className={`p-2 text-base ${bloqueado}`}
              value={company.condicionIva}
              disabled={!editable}
              onChange={(event) => onChange('condicionIva', event.target.value)}
            >
              {CONDICIONES_IVA.map((condicion) => (
                <option key={condicion} value={condicion}>
                  {condicion}
                </option>
              ))}
            </Select>
          </div>

          <Input
            contentLabel="Domicilio fiscal"
            containerClassname="sm:col-span-2"
            value={company.domicilioFiscal}
            error={errors.domicilioFiscal}
            disabled={!editable}
            className={bloqueado}
            onChange={(event) => onChange('domicilioFiscal', event.target.value)}
          />
          <Input
            contentLabel="Email de facturación"
            type="email"
            value={company.emailFacturacion}
            error={errors.emailFacturacion}
            disabled={!editable}
            className={bloqueado}
            onChange={(event) => onChange('emailFacturacion', event.target.value)}
          />
          <Input
            contentLabel="Teléfono de contacto"
            type="tel"
            value={company.telefonoContacto}
            error={errors.telefonoContacto}
            disabled={!editable}
            className={bloqueado}
            onChange={(event) => onChange('telefonoContacto', event.target.value)}
          />

          {/* Nunca editable: lo determina el alta del proveedor. */}
          <div className="flex w-full flex-col gap-2 sm:col-span-2">
            <span className="font-semibold text-[#1A2B4C]">Tipo de proveedor</span>
            <p className="flex w-max flex-row items-center gap-2 rounded-xl bg-black/5 px-3 py-2 text-sm text-[#44474E]">
              <span className="material-symbols-outlined text-[18px]!" aria-hidden="true">
                {company.tipoProveedor === 'Aerolínea' ? 'flight' : 'hotel'}
              </span>
              {company.tipoProveedor}
            </p>
          </div>
        </div>

        {editable && (
          <SaveRow
            status={status}
            onSave={onSave}
            successMessage="Datos de la empresa guardados."
          />
        )}
      </div>
    </ChartCard>
  );
};

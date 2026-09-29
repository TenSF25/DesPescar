import { ChartCard } from '../../../components/admin';
import { ToggleSwitch } from './ToggleSwitch';
import type { NotificationPrefs, SaveStatus } from '../admin-settings.types';

interface NotificationsSectionProps {
  notifications: NotificationPrefs;
  status: SaveStatus;
  onToggle: (campo: keyof NotificationPrefs) => void;
}

const OPCIONES: {
  campo: keyof NotificationPrefs;
  label: string;
  description: string;
}[] = [
  {
    campo: 'alertasSeguridad',
    label: 'Alertas de seguridad',
    description: 'Avisos de inicios de sesión en dispositivos desconocidos.',
  },
  {
    campo: 'nuevasReservas',
    label: 'Nuevas reservas',
    description: 'Un email cada vez que se confirma una reserva.',
  },
  {
    campo: 'resumenSemanal',
    label: 'Resumen semanal',
    description: 'Reporte de ventas y ocupación todos los lunes.',
  },
];

/**
 * Los toggles guardan solos al cambiarlos: no tienen botón de guardar,
 * porque es un solo dato booleano y esperar un submit se siente raro.
 */
export const NotificationsSection = ({
  notifications,
  status,
  onToggle,
}: NotificationsSectionProps) => {
  return (
    <ChartCard title="Notificaciones">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          {OPCIONES.map((opcion) => (
            <ToggleSwitch
              key={opcion.campo}
              label={opcion.label}
              description={opcion.description}
              checked={notifications[opcion.campo]}
              disabled={status === 'saving'}
              onChange={() => onToggle(opcion.campo)}
            />
          ))}
        </div>

        <div aria-live="polite" className="min-h-5 text-[13px]">
          {status === 'saving' && <p className="text-[#44474E]">Guardando…</p>}
          {status === 'success' && (
            <p className="text-success flex items-center gap-1.5 font-medium">
              <span className="material-symbols-outlined text-[18px]!" aria-hidden="true">
                check_circle
              </span>
              Preferencias guardadas.
            </p>
          )}
        </div>
      </div>
    </ChartCard>
  );
};

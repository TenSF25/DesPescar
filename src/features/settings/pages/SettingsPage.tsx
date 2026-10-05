import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/store/useAuthStore';
import { Card } from '@/features/profile/components/FormParts';
import { profileStore } from '@/features/profile/store/useProfileStore';
import { useMisReservasStore } from '@/features/reservations/store/useMisReservasStore';
import { useSettingsStore, type Settings } from '@/features/settings/store/useSettingsStore';

interface SwitchRowProps {
  title: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

const SwitchRow = ({ title, description, checked, onChange }: SwitchRowProps) => (
  <div className="flex items-center justify-between gap-4 sm:col-span-2">
    <div>
      <p className="text-secondary text-sm font-bold">{title}</p>
      {description && <p className="text-xs text-[#44474E]">{description}</p>}
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={title}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors',
        checked ? 'bg-primary' : 'bg-gray-300',
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
          checked && 'translate-x-5',
        )}
      />
    </button>
  </div>
);

const Subtitle = ({ children }: { children: ReactNode }) => (
  <h3 className="text-xs font-extrabold tracking-wide text-gray-400 uppercase sm:col-span-2">
    {children}
  </h3>
);

const Aviso = ({ tipo, children }: { tipo: 'ok' | 'error'; children: ReactNode }) => (
  <div
    role={tipo === 'ok' ? 'status' : 'alert'}
    className={cn(
      'flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold sm:col-span-2',
      tipo === 'ok'
        ? 'border-[#a5d6a7] bg-[#f0fdf4] text-[#15803d]'
        : 'border-[#fca5a5] bg-[#fff5f5] text-[#b91c1c]',
    )}
  >
    <span className="material-symbols-outlined text-[18px]!">
      {tipo === 'ok' ? 'check_circle' : 'error'}
    </span>
    {children}
  </div>
);

const descargarDatos = () => {
  const datos = {
    exportadoEl: new Date().toISOString(),
    perfil: profileStore.getSnapshot(),
    // Las reservas ya consultadas en esta sesión (Mis reservas las pide al servidor).
    reservas: useMisReservasStore.getState().reservas,
  };
  const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'mis-datos-despescar.json';
  a.click();
  URL.revokeObjectURL(url);
};

export const SettingsPage = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const { settings, updateSettings } = useSettingsStore();

  // TODO(backend): cambiar contraseña y eliminar cuenta se habilitan cuando existan los endpoints.
  const [guardadoAjuste, setGuardadoAjuste] = useState(false);

  const cambiar = (cambios: Partial<Settings>) => {
    updateSettings(cambios);
    setGuardadoAjuste(true);
  };

  const cerrarSesion = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-secondary relative flex min-h-32 flex-col justify-center overflow-hidden rounded-2xl px-6 py-8 sm:min-h-40 sm:px-11 sm:py-10">
        <div className="pointer-events-none absolute top-1/2 right-[-30px] h-85 w-85 -translate-y-1/2 rounded-full bg-white/3" />
        <h1 className="relative z-10 mb-2 text-2xl font-extrabold text-white sm:text-3xl">
          Ajustes
        </h1>
        <p className="relative z-10 text-sm font-medium text-white/65 sm:text-[15px]">
          Configurá cómo te avisamos, la seguridad de tu cuenta y tu privacidad.
        </p>
      </div>

      {guardadoAjuste && (
        <div className="grid">
          <Aviso tipo="ok">Ajuste guardado.</Aviso>
        </div>
      )}

      <Card title="Notificaciones" icon="notifications">
        <Subtitle>Qué querés recibir</Subtitle>
        <SwitchRow
          title="Ofertas y novedades"
          description="Promociones y vuelos con descuento."
          checked={settings.notifOfertas}
          onChange={(v) => cambiar({ notifOfertas: v })}
        />
        <SwitchRow
          title="Cambios en mis vuelos"
          description="Horarios, puertas de embarque y demoras."
          checked={settings.notifAlertasVuelo}
          onChange={(v) => cambiar({ notifAlertasVuelo: v })}
        />
        <SwitchRow
          title="Recordatorio de check-in"
          description="Te avisamos cuando se abre el check-in online."
          checked={settings.notifCheckin}
          onChange={(v) => cambiar({ notifCheckin: v })}
        />
        <SwitchRow
          title="Confirmaciones y comprobantes"
          description="Compras, cancelaciones y reembolsos."
          checked={settings.notifComprobantes}
          onChange={(v) => cambiar({ notifComprobantes: v })}
        />
        <Subtitle>Por qué canal</Subtitle>
        <SwitchRow
          title="Correo electrónico"
          checked={settings.canalEmail}
          onChange={(v) => cambiar({ canalEmail: v })}
        />
        <SwitchRow
          title="WhatsApp / SMS"
          checked={settings.canalWhatsapp}
          onChange={(v) => cambiar({ canalWhatsapp: v })}
        />
        <SwitchRow
          title="Notificaciones push"
          checked={settings.canalPush}
          onChange={(v) => cambiar({ canalPush: v })}
        />
      </Card>

      <Card title="Seguridad" icon="lock">
        <SwitchRow
          title="Verificación en dos pasos"
          description="Pedimos un código extra al iniciar sesión desde un dispositivo nuevo."
          checked={settings.dosPasos}
          onChange={(v) => cambiar({ dosPasos: v })}
        />
      </Card>

      <Card title="Privacidad" icon="shield">
        <SwitchRow
          title="Personalizar mis recomendaciones"
          description="Usamos tu historial de viajes para sugerirte destinos y ofertas."
          checked={settings.personalizacion}
          onChange={(v) => cambiar({ personalizacion: v })}
        />
        <div className="flex items-center justify-between gap-4 sm:col-span-2">
          <div>
            <p className="text-secondary text-sm font-bold">Descargar mis datos</p>
            <p className="text-xs text-[#44474E]">
              Una copia de tu perfil y tus reservas en formato JSON.
            </p>
          </div>
          <Button variant="secondary" className="w-auto shrink-0 px-5" onClick={descargarDatos}>
            <span className="material-symbols-outlined text-[18px]!">download</span>
            Descargar
          </Button>
        </div>
      </Card>

      <Card title="Cuenta" icon="manage_accounts">
        <div className="flex items-center justify-between gap-4 sm:col-span-2">
          <div>
            <p className="text-secondary text-sm font-bold">Cerrar sesión</p>
            <p className="text-xs text-[#44474E]">Salís de tu cuenta en este dispositivo.</p>
          </div>
          <Button variant="secondary" className="w-auto shrink-0 px-5" onClick={cerrarSesion}>
            Cerrar sesión
          </Button>
        </div>
      </Card>
    </div>
  );
};

import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'despescar_settings';

type Listener = () => void;

export interface Settings {
  /** Qué avisos recibir */
  notifOfertas: boolean;
  notifAlertasVuelo: boolean;
  notifCheckin: boolean;
  notifComprobantes: boolean;
  /** Por qué canal */
  canalEmail: boolean;
  canalWhatsapp: boolean;
  canalPush: boolean;
  /** Seguridad y privacidad */
  dosPasos: boolean;
  personalizacion: boolean;
}

export const ajustesPorDefecto: Settings = {
  notifOfertas: true,
  notifAlertasVuelo: true,
  notifCheckin: true,
  notifComprobantes: true,
  canalEmail: true,
  canalWhatsapp: false,
  canalPush: true,
  dosPasos: false,
  personalizacion: true,
};

const leer = (): Settings => {
  try {
    const guardado = localStorage.getItem(STORAGE_KEY);
    return guardado ? { ...ajustesPorDefecto, ...JSON.parse(guardado) } : ajustesPorDefecto;
  } catch {
    return ajustesPorDefecto;
  }
};

let ajustes = leer();
const listeners = new Set<Listener>();

const emit = () => listeners.forEach((listener) => listener());

/** Store mínimo tipo store externo, sin dependencias nuevas, para los ajustes de la cuenta. */
export const settingsStore = {
  update: (cambios: Partial<Settings>) => {
    ajustes = { ...ajustes, ...cambios };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ajustes));
    } catch {
      // localStorage no disponible (modo privado, etc.)
    }
    emit();
  },
  getSnapshot: () => ajustes,
  subscribe: (listener: Listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

export const useSettingsStore = () => {
  const settings = useSyncExternalStore(settingsStore.subscribe, settingsStore.getSnapshot);
  return { settings, updateSettings: settingsStore.update };
};

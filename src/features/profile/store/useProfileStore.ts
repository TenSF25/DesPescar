import { useSyncExternalStore } from 'react';
import type { Profile } from '@/features/profile/profile.types';

const STORAGE_KEY = 'despescar_profile';

type Listener = () => void;

export const perfilPorDefecto: Profile = {
  foto: '',
  nombre: '',
  apellido: '',
  fechaNacimiento: '',
  genero: '',
  nacionalidad: 'Argentina',
  tipoDocumento: 'DNI',
  numeroDocumento: '',
  email: '',
  telefono: '',
  provincia: '',
  ciudad: '',
  direccion: '',
  codigoPostal: '',
  asientoPreferido: 'Sin preferencia',
  comida: 'Sin preferencia',
  aeropuertoOrigen: '',
  asistenciaEspecial: false,
  numeroMillas: '',
  emergenciaNombre: '',
  emergenciaTelefono: '',
};

const leer = (): Profile => {
  try {
    const guardado = localStorage.getItem(STORAGE_KEY);
    return guardado ? { ...perfilPorDefecto, ...JSON.parse(guardado) } : perfilPorDefecto;
  } catch {
    return perfilPorDefecto;
  }
};

let perfil = leer();
const listeners = new Set<Listener>();

const emit = () => listeners.forEach((listener) => listener());

/** Store mínimo tipo store externo, sin dependencias nuevas, para los datos del usuario. */
export const profileStore = {
  save: (nuevo: Profile) => {
    perfil = nuevo;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevo));
    } catch {
      // localStorage no disponible (modo privado, etc.)
    }
    emit();
  },
  getSnapshot: () => perfil,
  subscribe: (listener: Listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

export const useProfileStore = () => {
  const profile = useSyncExternalStore(profileStore.subscribe, profileStore.getSnapshot);
  return { profile, saveProfile: profileStore.save };
};

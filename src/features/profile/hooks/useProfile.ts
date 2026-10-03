import { useMemo } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileStore } from '@/features/profile/store/useProfileStore';

/**
 * Perfil del viajero. Nombre, apellido y correo pertenecen a la cuenta (los provee el backend vía
 * useAuthStore); el resto de los campos se guarda localmente hasta que el backend los persista.
 */
export const useProfile = () => {
  const { profile, saveProfile } = useProfileStore();
  const user = useAuthStore((state) => state.user);

  const perfil = useMemo(
    () => ({
      ...profile,
      nombre: user?.firsName ?? profile.nombre,
      apellido: user?.lastName ?? profile.apellido,
      email: user?.email ?? profile.email,
    }),
    [profile, user],
  );

  return { profile: perfil, saveProfile };
};

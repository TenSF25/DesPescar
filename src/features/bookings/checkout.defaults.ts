import { splitPhone, DEFAULT_DIAL_CODE } from '@/utils/countries';
import type { Profile } from '@/features/profile/profile.types';
import { GENEROS, type ContactData, type PassengerData } from './checkout.types';

const emptyPassenger = (): PassengerData => ({
  nombre: '',
  apellido: '',
  tipoDocumento: 'DNI',
  numeroDocumento: '',
  fechaNacimiento: '',
  genero: '',
  nacionalidad: 'Argentina',
});

/** El primer pasajero es quien compra: se precarga con su perfil. Los demás arrancan vacíos. */
export const buildInitialPassengers = (count: number, profile: Profile): PassengerData[] =>
  Array.from({ length: count }, (_, index) =>
    index === 0
      ? {
          nombre: profile.nombre,
          apellido: profile.apellido,
          tipoDocumento: profile.tipoDocumento,
          numeroDocumento: profile.numeroDocumento,
          fechaNacimiento: profile.fechaNacimiento,
          genero: (GENEROS as readonly string[]).includes(profile.genero) ? profile.genero : '',
          nacionalidad: profile.nacionalidad || 'Argentina',
        }
      : emptyPassenger(),
  );

/** ¿El perfil trae algún dato para precargar al primer pasajero? */
export const hasProfileData = (profile: Profile) =>
  Boolean(profile.nombre || profile.apellido || profile.numeroDocumento || profile.fechaNacimiento);

/** El correo de la cuenta se propone, pero hay que repetirlo; el teléfono del perfil, si existe. */
export const buildInitialContact = (profile: Profile): ContactData => {
  const telefono = profile.telefono ? splitPhone(profile.telefono) : null;
  return {
    email: profile.email,
    confirmEmail: '',
    telefonos: [
      {
        tipo: 'Móvil',
        codigo: telefono?.codigo ?? DEFAULT_DIAL_CODE,
        numero: telefono?.numero ?? '',
      },
    ],
  };
};

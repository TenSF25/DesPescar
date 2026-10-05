export const TIPOS_DOCUMENTO = ['DNI', 'Pasaporte'] as const;
export type TipoDocumento = (typeof TIPOS_DOCUMENTO)[number];

export const GENEROS = ['Femenino', 'Masculino', 'No binario'] as const;

export const TIPOS_TELEFONO = ['Móvil', 'Casa', 'Trabajo'] as const;
export type TipoTelefono = (typeof TIPOS_TELEFONO)[number];

/** Datos que las aerolíneas piden de cada pasajero (deben coincidir con su documento). */
export interface PassengerData {
  nombre: string;
  apellido: string;
  tipoDocumento: TipoDocumento;
  numeroDocumento: string;
  fechaNacimiento: string; // YYYY-MM-DD
  genero: string;
  nacionalidad: string;
}

export interface PhoneData {
  tipo: TipoTelefono;
  codigo: string; // "+54"
  numero: string;
}

export interface ContactData {
  email: string;
  confirmEmail: string;
  telefonos: PhoneData[];
}

export type FieldErrors = Record<string, string>;

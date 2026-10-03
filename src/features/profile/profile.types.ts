export interface Profile {
  /** Foto de perfil como data URL (vacío = sin foto). */
  foto: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  genero: string;
  nacionalidad: string;
  tipoDocumento: 'DNI' | 'Pasaporte';
  numeroDocumento: string;
  email: string;
  telefono: string;
  provincia: string;
  ciudad: string;
  direccion: string;
  codigoPostal: string;
  asientoPreferido: string;
  comida: string;
  aeropuertoOrigen: string;
  asistenciaEspecial: boolean;
  numeroMillas: string;
  emergenciaNombre: string;
  emergenciaTelefono: string;
}

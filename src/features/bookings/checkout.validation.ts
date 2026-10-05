import type { ContactData, FieldErrors, PassengerData } from './checkout.types';

const NOMBRE = /^[\p{L}][\p{L}\s'.-]*$/u;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const edadEnAnios = (fecha: string) => {
  const nacimiento = new Date(fecha + 'T00:00:00');
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const cumpleEsteAnio = new Date(hoy.getFullYear(), nacimiento.getMonth(), nacimiento.getDate());
  if (hoy < cumpleEsteAnio) edad -= 1;
  return edad;
};

/** Errores de un pasajero, por nombre de campo. Vacío = datos válidos. */
export const validatePassenger = (p: PassengerData): FieldErrors => {
  const errores: FieldErrors = {};

  if (!p.nombre.trim()) errores.nombre = 'Ingresá el nombre tal como figura en el documento';
  else if (!NOMBRE.test(p.nombre.trim())) errores.nombre = 'El nombre solo puede tener letras';

  if (!p.apellido.trim()) errores.apellido = 'Ingresá el apellido tal como figura en el documento';
  else if (!NOMBRE.test(p.apellido.trim()))
    errores.apellido = 'El apellido solo puede tener letras';

  const documento = p.numeroDocumento.replace(/[\s.-]/g, '');
  if (!documento) errores.numeroDocumento = 'Ingresá el número de documento';
  else if (p.tipoDocumento === 'DNI' && !/^\d{7,8}$/.test(documento)) {
    errores.numeroDocumento = 'El DNI tiene 7 u 8 números';
  } else if (p.tipoDocumento === 'Pasaporte' && !/^[A-Za-z0-9]{6,9}$/.test(documento)) {
    errores.numeroDocumento = 'El pasaporte tiene entre 6 y 9 letras o números';
  }

  if (!p.fechaNacimiento) errores.fechaNacimiento = 'Ingresá la fecha de nacimiento';
  else if (new Date(p.fechaNacimiento + 'T00:00:00') > new Date()) {
    errores.fechaNacimiento = 'La fecha no puede ser futura';
  } else if (edadEnAnios(p.fechaNacimiento) > 120) {
    errores.fechaNacimiento = 'Revisá la fecha de nacimiento';
  }

  if (!p.genero) errores.genero = 'Elegí una opción';
  if (!p.nacionalidad) errores.nacionalidad = 'Elegí la nacionalidad';

  return errores;
};

/** Mismo documento cargado en dos pasajeros: devuelve los índices repetidos (todos menos el primero). */
export const findDuplicatedDocuments = (passengers: PassengerData[]) => {
  const vistos = new Set<string>();
  const repetidos = new Set<number>();
  passengers.forEach((p, index) => {
    const clave = `${p.tipoDocumento}:${p.numeroDocumento.replace(/[\s.-]/g, '').toUpperCase()}`;
    if (!p.numeroDocumento.trim()) return;
    if (vistos.has(clave)) repetidos.add(index);
    vistos.add(clave);
  });
  return repetidos;
};

/** Errores del contacto. Los de los teléfonos usan la clave `telefono{índice}-codigo|numero`. */
export const validateContact = (c: ContactData): FieldErrors => {
  const errores: FieldErrors = {};

  if (!c.email.trim()) errores.email = 'Ingresá el correo donde enviamos los vouchers';
  else if (!EMAIL.test(c.email.trim())) errores.email = 'Ingresá un correo válido';

  if (!c.confirmEmail.trim()) errores.confirmEmail = 'Repetí el correo para confirmarlo';
  else if (c.confirmEmail.trim().toLowerCase() !== c.email.trim().toLowerCase()) {
    errores.confirmEmail = 'Los correos no coinciden';
  }

  c.telefonos.forEach((tel, index) => {
    const numero = tel.numero.replace(/[\s()-]/g, '');
    if (!tel.codigo) errores[`telefono${index}-codigo`] = 'Elegí el código de país';
    if (!numero) {
      errores[`telefono${index}-numero`] =
        index === 0
          ? 'Ingresá un teléfono de contacto'
          : 'Completá el número o quitá este teléfono';
    } else if (!/^\d{6,12}$/.test(numero)) {
      errores[`telefono${index}-numero`] = 'Ingresá solo números (entre 6 y 12 dígitos)';
    }
  });

  return errores;
};

/**
 * Tipos de la sección de Ajustes del panel de administrador.
 *
 * Esta feature es compartida: la usan los tres dashboards (admin general,
 * aerolínea y hotel). Por eso los nombres son genéricos ("proveedor" en vez
 * de "aerolínea") y los campos de empresa sirven igual para una aerolínea
 * que para un hospedaje.
 */

/**
 * Rol del usuario logueado.
 *
 * Coincide a propósito con el `RolId` que define features/auth en la rama
 * admin-general, así el día que se unifiquen las ramas esto se reemplaza por
 * un import y no hay que tocar nada más.
 */
export type AdminRole = 'GENERAL_ADMIN' | 'AIRLINE_ADMIN' | 'HOTEL_ADMIN';

/** Tipo de proveedor. Lo define el alta, no se edita desde Ajustes. */
export type ProviderType = 'Aerolínea' | 'Hospedaje';

/** Condición frente al IVA (AFIP). */
export type TaxCondition = 'Responsable Inscripto' | 'Monotributo' | 'Exento';

/** Datos personales de quien está logueado. */
export interface AdminProfile {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  cargo: string;
}

/**
 * Datos fiscales de la empresa proveedora.
 *
 * Solo la ven los roles que tienen empresa (aerolínea y hotel). El admin
 * general es dueño de la plataforma, no tiene empresa propia.
 */
export interface CompanyData {
  razonSocial: string;
  cuit: string;
  nombreComercial: string;
  condicionIva: TaxCondition;
  domicilioFiscal: string;
  emailFacturacion: string;
  telefonoContacto: string;
  /** Solo lectura: lo determina el rol, no se edita acá. */
  tipoProveedor: ProviderType;
}

/** Preferencias de notificaciones por email. */
export interface NotificationPrefs {
  alertasSeguridad: boolean;
  nuevasReservas: boolean;
  resumenSemanal: boolean;
}

/** Formulario de cambio de contraseña. */
export interface PasswordChange {
  actual: string;
  nueva: string;
  repetir: string;
}

/**
 * Estado de guardado de cada sección. Cada tarjeta guarda por separado, así
 * un error en una no bloquea a las demás.
 */
export type SaveStatus = 'idle' | 'saving' | 'success' | 'error';

/** Errores de validación de un formulario, por nombre de campo. */
export type FieldErrors<T> = Partial<Record<keyof T, string>>;

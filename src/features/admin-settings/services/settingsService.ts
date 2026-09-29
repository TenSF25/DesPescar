import { mockDelay } from '../../../services/mockDelay';
// import { apiRequest } from '../../../services/apiClient';
// import { API_CONFIG } from '../../../services/apiConfig';
import type {
  AdminProfile,
  AdminRole,
  CompanyData,
  NotificationPrefs,
  PasswordChange,
} from '../admin-settings.types';

/**
 * Service de Ajustes. Por ahora devuelve mocks con una latencia simulada,
 * igual que el resto de los services del admin. Cada función tiene arriba
 * el TODO con la llamada real que la va a reemplazar.
 *
 * Los "guardar" modifican el mock en memoria: al recargar la página vuelve
 * el valor original. Eso es a propósito, no hay persistencia hasta que esté
 * el backend.
 */

const MOCK_PROFILE: AdminProfile = {
  nombre: 'Daiana',
  apellido: 'Pérez',
  email: 'daiana.perez@despescar.com',
  telefono: '+54 11 4567-8900',
  cargo: 'Administradora',
};

const MOCK_COMPANY_AEROLINEA: CompanyData = {
  razonSocial: 'Aerolíneas DesPescar S.A.',
  cuit: '30-71041261-4',
  nombreComercial: 'DesPescar',
  condicionIva: 'Responsable Inscripto',
  domicilioFiscal: 'Av. Corrientes 1234, CABA',
  emailFacturacion: 'facturacion@despescar.com',
  telefonoContacto: '+54 11 4000-1000',
  tipoProveedor: 'Aerolínea',
};

const MOCK_COMPANY_HOSPEDAJE: CompanyData = {
  razonSocial: 'Hotelería del Sur S.R.L.',
  cuit: '33-69345023-9',
  nombreComercial: 'Cabañas Nahuel',
  condicionIva: 'Monotributo',
  domicilioFiscal: 'Av. Bustillo 8500, San Carlos de Bariloche',
  emailFacturacion: 'administracion@cabanasnahuel.com',
  telefonoContacto: '+54 294 445-2200',
  tipoProveedor: 'Hospedaje',
};

const MOCK_NOTIFICATIONS: NotificationPrefs = {
  alertasSeguridad: true,
  nuevasReservas: true,
  resumenSemanal: false,
};

// Copias mutables: así "guardar" se nota mientras dura la sesión.
let perfilActual: AdminProfile = { ...MOCK_PROFILE };
// Cada administrador ve la empresa que tiene asignada. Con el backend
// real la resuelve el token; acá se elige segun el rol.
const empresasPorRol: Partial<Record<AdminRole, CompanyData>> = {
  AIRLINE_ADMIN: { ...MOCK_COMPANY_AEROLINEA },
  HOTEL_ADMIN: { ...MOCK_COMPANY_HOSPEDAJE },
};
let notificacionesActuales: NotificationPrefs = { ...MOCK_NOTIFICATIONS };

// TODO(backend): apiRequest<AdminProfile>(API_CONFIG.usersServiceUrl, '/perfil')
export const getProfile = async (): Promise<AdminProfile> => {
  await mockDelay();
  return perfilActual;
};

// TODO(backend): apiRequest(API_CONFIG.usersServiceUrl, '/perfil', { method: 'PUT', body: perfil })
export const updateProfile = async (perfil: AdminProfile): Promise<AdminProfile> => {
  await mockDelay();
  perfilActual = { ...perfil };
  return perfilActual;
};

// TODO(backend): apiRequest<CompanyData>(API_CONFIG.usersServiceUrl, '/empresa')
export const getCompany = async (rol: AdminRole): Promise<CompanyData | null> => {
  await mockDelay();
  return empresasPorRol[rol] ?? null;
};

// TODO(backend): apiRequest(API_CONFIG.usersServiceUrl, '/empresa', { method: 'PUT', body: empresa })
export const updateCompany = async (
  rol: AdminRole,
  empresa: CompanyData,
): Promise<CompanyData> => {
  await mockDelay();
  empresasPorRol[rol] = { ...empresa };
  return empresa;
};

// TODO(backend): apiRequest<NotificationPrefs>(API_CONFIG.usersServiceUrl, '/perfil/notificaciones')
export const getNotifications = async (): Promise<NotificationPrefs> => {
  await mockDelay();
  return notificacionesActuales;
};

// TODO(backend): apiRequest(API_CONFIG.usersServiceUrl, '/perfil/notificaciones', { method: 'PUT', body: prefs })
export const updateNotifications = async (
  prefs: NotificationPrefs,
): Promise<NotificationPrefs> => {
  await mockDelay();
  notificacionesActuales = { ...prefs };
  return notificacionesActuales;
};

/**
 * Cambio de contraseña.
 *
 * La contraseña actual se valida contra este mock. Cuando esté el backend,
 * esa verificación se hace del lado del servidor y acá solo se manda el POST.
 */
const MOCK_CURRENT_PASSWORD = 'admin1234';

// TODO(backend): apiRequest(API_CONFIG.usersServiceUrl, '/perfil/password', { method: 'POST', body: datos })
export const changePassword = async (datos: PasswordChange): Promise<void> => {
  await mockDelay();

  if (datos.actual !== MOCK_CURRENT_PASSWORD) {
    throw new Error('La contraseña actual no es correcta.');
  }
};

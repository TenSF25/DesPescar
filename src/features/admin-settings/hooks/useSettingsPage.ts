import { useEffect, useState } from 'react';
import {
  changePassword,
  getCompany,
  getNotifications,
  getProfile,
  updateCompany,
  updateNotifications,
  updateProfile,
} from '../services/settingsService';
import {
  formatCuit,
  validateCuit,
  validateEmail,
  validateNewPassword,
  validatePasswordMatch,
  validateRequired,
} from '../utils/validators';
import { useAdminRole } from './useAdminRole';
import type {
  AdminProfile,
  CompanyData,
  FieldErrors,
  NotificationPrefs,
  PasswordChange,
  SaveStatus,
} from '../admin-settings.types';

const PASSWORD_VACIO: PasswordChange = { actual: '', nueva: '', repetir: '' };

/**
 * Toda la lógica de la página de Ajustes vive acá: carga de datos,
 * validación y guardado. `SettingsPage.tsx` solo arma el JSX con lo que
 * este hook devuelve.
 *
 * Cada sección tiene su propio estado de guardado, así un error en una no
 * bloquea a las otras.
 */
export const useSettingsPage = () => {
  const { rol, esProveedor, puedeEditarEmpresa } = useAdminRole();

  const [isLoading, setIsLoading] = useState(true);

  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [notifications, setNotifications] = useState<NotificationPrefs | null>(null);
  const [password, setPassword] = useState<PasswordChange>(PASSWORD_VACIO);

  const [profileStatus, setProfileStatus] = useState<SaveStatus>('idle');
  const [companyStatus, setCompanyStatus] = useState<SaveStatus>('idle');
  const [passwordStatus, setPasswordStatus] = useState<SaveStatus>('idle');
  const [notificationsStatus, setNotificationsStatus] = useState<SaveStatus>('idle');

  const [profileErrors, setProfileErrors] = useState<FieldErrors<AdminProfile>>({});
  const [companyErrors, setCompanyErrors] = useState<FieldErrors<CompanyData>>({});
  const [passwordErrors, setPasswordErrors] = useState<FieldErrors<PasswordChange>>({});
  const [passwordServerError, setPasswordServerError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setIsLoading(true);

      // La empresa solo se pide si el rol tiene empresa.
      const [profileData, notificationsData, companyData] = await Promise.all([
        getProfile(),
        getNotifications(),
        esProveedor ? getCompany(rol) : Promise.resolve(null),
      ]);

      if (!isMounted) return;
      setProfile(profileData);
      setNotifications(notificationsData);
      setCompany(companyData);
      setIsLoading(false);
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [esProveedor, rol]);

  /* ---------------------------------------------------------------- perfil */

  const onProfileChange = (campo: keyof AdminProfile, valor: string) => {
    setProfile((previo) => (previo ? { ...previo, [campo]: valor } : previo));
    setProfileErrors((previo) => ({ ...previo, [campo]: undefined }));
    setProfileStatus('idle');
  };

  const saveProfile = async () => {
    if (!profile) return;

    const errores: FieldErrors<AdminProfile> = {
      nombre: validateRequired(profile.nombre, 'El nombre') ?? undefined,
      apellido: validateRequired(profile.apellido, 'El apellido') ?? undefined,
      email: validateEmail(profile.email) ?? undefined,
    };

    if (Object.values(errores).some(Boolean)) {
      setProfileErrors(errores);
      setProfileStatus('error');
      return;
    }

    setProfileErrors({});
    setProfileStatus('saving');
    await updateProfile(profile);
    setProfileStatus('success');
  };

  /* --------------------------------------------------------------- empresa */

  const onCompanyChange = (campo: keyof CompanyData, valor: string) => {
    // El CUIT se va formateando mientras se escribe (30-12345678-9).
    const valorFinal = campo === 'cuit' ? formatCuit(valor) : valor;

    setCompany((previo) => (previo ? { ...previo, [campo]: valorFinal } : previo));
    setCompanyErrors((previo) => ({ ...previo, [campo]: undefined }));
    setCompanyStatus('idle');
  };

  const saveCompany = async () => {
    // Guarda de seguridad: solo el admin general edita los datos fiscales.
    // La UI ya muestra la sección bloqueada, esto es el cinturón extra.
    if (!company || !puedeEditarEmpresa) return;

    const errores: FieldErrors<CompanyData> = {
      razonSocial: validateRequired(company.razonSocial, 'La razón social') ?? undefined,
      cuit: validateCuit(company.cuit) ?? undefined,
      emailFacturacion: validateEmail(company.emailFacturacion) ?? undefined,
    };

    if (Object.values(errores).some(Boolean)) {
      setCompanyErrors(errores);
      setCompanyStatus('error');
      return;
    }

    setCompanyErrors({});
    setCompanyStatus('saving');
    await updateCompany(rol, company);
    setCompanyStatus('success');
  };

  /* ------------------------------------------------------------- seguridad */

  const onPasswordChange = (campo: keyof PasswordChange, valor: string) => {
    setPassword((previo) => ({ ...previo, [campo]: valor }));
    setPasswordErrors((previo) => ({ ...previo, [campo]: undefined }));
    setPasswordServerError(null);
    setPasswordStatus('idle');
  };

  const savePassword = async () => {
    const errores: FieldErrors<PasswordChange> = {
      actual: validateRequired(password.actual, 'La contraseña actual') ?? undefined,
      nueva: validateNewPassword(password.nueva) ?? undefined,
      repetir: validatePasswordMatch(password.nueva, password.repetir) ?? undefined,
    };

    if (Object.values(errores).some(Boolean)) {
      setPasswordErrors(errores);
      setPasswordStatus('error');
      return;
    }

    setPasswordErrors({});
    setPasswordServerError(null);
    setPasswordStatus('saving');

    try {
      await changePassword(password);
      setPassword(PASSWORD_VACIO);
      setPasswordStatus('success');
    } catch (error) {
      setPasswordServerError(
        error instanceof Error ? error.message : 'No se pudo cambiar la contraseña.',
      );
      setPasswordStatus('error');
    }
  };

  /* --------------------------------------------------------- notificaciones */

  // Los toggles guardan solos: se cambia el switch y se persiste, sin botón.
  const onNotificationToggle = async (campo: keyof NotificationPrefs) => {
    if (!notifications) return;

    const actualizadas = { ...notifications, [campo]: !notifications[campo] };
    setNotifications(actualizadas);
    setNotificationsStatus('saving');
    await updateNotifications(actualizadas);
    setNotificationsStatus('success');
  };

  return {
    isLoading,
    rol,
    esProveedor,
    puedeEditarEmpresa,

    profile,
    profileErrors,
    profileStatus,
    onProfileChange,
    saveProfile,

    company,
    companyErrors,
    companyStatus,
    onCompanyChange,
    saveCompany,

    password,
    passwordErrors,
    passwordServerError,
    passwordStatus,
    onPasswordChange,
    savePassword,

    notifications,
    notificationsStatus,
    onNotificationToggle,
  };
};

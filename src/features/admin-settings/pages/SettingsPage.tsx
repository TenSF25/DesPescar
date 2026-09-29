import { PageHeader } from '../../../components/admin';
import { CompanySection } from '../components/CompanySection';
import { NotificationsSection } from '../components/NotificationsSection';
import { ProfileSection } from '../components/ProfileSection';
import { SecuritySection } from '../components/SecuritySection';
import { useSettingsPage } from '../hooks/useSettingsPage';

/**
 * Página de Ajustes del panel de administrador.
 *
 * Es compartida por los tres dashboards (admin general, aerolínea y hotel).
 * La sección de datos de la empresa solo se muestra a los roles que tienen
 * empresa; el admin general es dueño de la plataforma y no tiene una.
 */
export const SettingsPage = () => {
  const {
    isLoading,
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
  } = useSettingsPage();

  if (isLoading || !profile || !notifications) {
    return (
      <>
        <PageHeader title="Ajustes" description="Administrá tu cuenta y tus datos." />
        <p className="text-sm text-[#44474E]">Cargando…</p>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Ajustes"
        description={
          esProveedor
            ? 'Administrá tu cuenta y consultá los datos de tu empresa.'
            : 'Administrá tu cuenta.'
        }
      />

      {/*
        Dos columnas en pantallas grandes, como el resto del admin, para no
        dejar media pantalla vacía a la derecha. En chico se apila todo.

        Están agrupadas por si se pueden editar o no: a la izquierda todo lo
        que el administrador puede cambiar, y al costado los datos de la
        empresa, que son fijos y solo se consultan.
      */}
      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-2">
        <div className="flex flex-col gap-4">
          <ProfileSection
            profile={profile}
            errors={profileErrors}
            status={profileStatus}
            onChange={onProfileChange}
            onSave={saveProfile}
          />

          <SecuritySection
            password={password}
            errors={passwordErrors}
            serverError={passwordServerError}
            status={passwordStatus}
            onChange={onPasswordChange}
            onSave={savePassword}
          />

          <NotificationsSection
            notifications={notifications}
            status={notificationsStatus}
            onToggle={onNotificationToggle}
          />
        </div>

        {esProveedor && company && (
          <CompanySection
            company={company}
            errors={companyErrors}
            status={companyStatus}
            onChange={onCompanyChange}
            onSave={saveCompany}
            editable={puedeEditarEmpresa}
          />
        )}
      </div>

    </>
  );
};

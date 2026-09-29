import type { AdminRole } from '../admin-settings.types';

/**
 * Rol del administrador logueado.
 *
 * ────────────────────────────────────────────────────────────────────
 * ÚNICO PUNTO A TOCAR CUANDO SE UNIFIQUEN LAS RAMAS DEL ADMIN
 *
 * Hoy devuelve un rol fijo porque `useAuthStore` todavía está vacío en
 * esta rama (el store real, con los cuatro roles, vive en la rama
 * features/admin-general).
 *
 * Cuando esa rama se mergee, reemplazar el cuerpo por:
 *
 *   const { user } = useAuthStore();
 *   const rol = (user?.rolId ?? 'AIRLINE_ADMIN') as AdminRole;
 *
 * y borrar la constante de abajo. El resto de la feature no cambia:
 * todos consumen este hook, nadie lee el store directo.
 * ────────────────────────────────────────────────────────────────────
 */

/**
 * Cambiar acá para probar la página con otro rol mientras no haya login.
 * El `as AdminRole` es para que TypeScript lo trate como la unión completa
 * y no como este valor puntual; si no, da las comparaciones por imposibles.
 */
const ROL_MOCK = 'AIRLINE_ADMIN' as AdminRole;

export const useAdminRole = () => {
  const rol: AdminRole = ROL_MOCK;

  // El admin general es dueño de la plataforma: no tiene empresa propia,
  // por eso no ve la sección de datos fiscales en SUS ajustes.
  const esProveedor = rol === 'AIRLINE_ADMIN' || rol === 'HOTEL_ADMIN';

  /**
   * Quién puede editar los datos fiscales de una empresa.
   *
   * Por cada empresa (aerolínea u hospedaje) hay un solo administrador, y
   * el alta se la da el admin general. Los datos fiscales los carga él en
   * ese momento: el admin de la empresa los ve pero no los toca, por un
   * tema de veracidad y control.
   */
  const puedeEditarEmpresa = rol === 'GENERAL_ADMIN';

  return { rol, esProveedor, puedeEditarEmpresa };
};

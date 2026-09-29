import { NavLink } from 'react-router-dom';
import { cn } from '../../../utils/cn';
import { adminNavItems } from './adminNav.config';
import type { AdminNavEntry } from '../admin.types';

interface AdminSidebarProps {
  /**
   * Ítems del menú. Opcional: sin esto usa `adminNavItems`, así nada de lo
   * que ya usa <AdminSidebar /> sin props se rompe.
   */
  items?: AdminNavEntry[];
  /** Solo en móvil: si el menú está desplegado. */
  isOpen?: boolean;
  /** Se llama al navegar o al tocar el fondo, para cerrar el menú en móvil. */
  onClose?: () => void;
}

const linkClases =
  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white';

/**
 * Menú lateral del panel de administrador.
 *
 * - En escritorio queda fijo con `sticky top-0 h-screen`: acompaña el
 *   scroll y ya no deja el hueco gris de antes, que pasaba porque el aside
 *   medía una pantalla mientras el layout crecía con el contenido.
 * - En móvil se esconde y se abre como panel sobre el contenido: 256px
 *   fijos se comían dos tercios de la pantalla de un teléfono.
 */
export const AdminSidebar = ({
  items = adminNavItems,
  isOpen = false,
  onClose,
}: AdminSidebarProps) => {
  return (
    <>
      {/* Fondo oscuro detrás del menú desplegado (solo móvil) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'bg-secondary fixed inset-y-0 left-0 z-50 flex h-screen w-64 shrink-0 flex-col justify-between p-4 text-white transition-transform duration-300',
          // En escritorio: siempre visible y pegado al borde superior.
          'lg:sticky lg:top-0 lg:z-auto lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex min-h-0 flex-col gap-8">
          <div className="flex items-center justify-between gap-2 px-2 py-2">
            <div className="flex items-center gap-2">
              <img
                src="/despescar.webp"
                alt="Despescar"
                className="h-9 w-9 rounded-full object-cover"
              />
              <div className="flex flex-col leading-tight">
                <span className="text-lg font-bold tracking-widest">DESPESCAR</span>
                <span className="text-primary text-[10px] font-semibold tracking-wider">
                  VUELA DIFERENTE
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar menú"
              className="cursor-pointer text-white/70 hover:text-white lg:hidden"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Si el menú crece, scrollea solo él y no el layout entero. */}
          <nav className="flex min-h-0 flex-col gap-1 overflow-y-auto">
            {items.map((item) =>
              item.type === 'title' ? (
                <div
                  key={item.label}
                  className="flex cursor-default items-center gap-3 px-3 py-2.5 text-sm font-semibold text-white/40"
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  {item.label}
                </div>
              ) : (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(linkClases, isActive && 'bg-primary hover:bg-primary text-white')
                  }
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  {item.label}
                </NavLink>
              ),
            )}
          </nav>
        </div>

        <button type="button" className={cn(linkClases, 'text-primary cursor-pointer')}>
          <span className="material-symbols-outlined text-[20px]">logout</span>
          Cerrar sesión
        </button>
      </aside>
    </>
  );
};

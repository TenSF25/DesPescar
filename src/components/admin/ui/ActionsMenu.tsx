import { useState } from 'react';

export interface ActionsMenuAction {
  label: string;
  icon: string;
  onClick: () => void;
  tone?: 'default' | 'danger';
}

interface ActionsMenuProps {
  onView?: () => void;
  onEdit?: () => void;
  /** Uso simple (como antes): un solo click, sin menú. */
  onMore?: () => void;
  /** Uso nuevo: si se pasa, "más opciones" abre un menú desplegable real con estas acciones. */
  menuActions?: ActionsMenuAction[];
}

export const ActionsMenu = ({ onView, onEdit, onMore, menuActions }: ActionsMenuProps) => {
  const [abierto, setAbierto] = useState(false);
  const tieneMenu = !!menuActions && menuActions.length > 0;

  const alClickMas = () => {
    if (tieneMenu) {
      setAbierto((prev) => !prev);
    } else if (onMore) {
      onMore();
    }
  };

  return (
    <div className="relative flex items-center gap-3 text-[#44474E]">
      {onView && (
        <button type="button" onClick={onView} className="cursor-pointer hover:text-secondary">
          <span className="material-symbols-outlined text-[20px]">visibility</span>
        </button>
      )}
      {onEdit && (
        <button type="button" onClick={onEdit} className="cursor-pointer hover:text-secondary">
          <span className="material-symbols-outlined text-[20px]">edit</span>
        </button>
      )}
      {(onMore || tieneMenu) && (
        <button type="button" onClick={alClickMas} className="cursor-pointer hover:text-secondary">
          <span className="material-symbols-outlined text-[20px]">more_vert</span>
        </button>
      )}

      {abierto && tieneMenu && (
        <>
          {/* Capa invisible para cerrar el menú al hacer click afuera */}
          <div className="fixed inset-0 z-10" onClick={() => setAbierto(false)} />
          <div className="absolute top-full right-0 z-20 mt-1 w-52 rounded-xl border border-black/10 bg-white py-1 shadow-lg">
            {menuActions!.map((accion) => (
              <button
                key={accion.label}
                type="button"
                onClick={() => {
                  accion.onClick();
                  setAbierto(false);
                }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-black/5 ${
                  accion.tone === 'danger' ? 'text-alert' : 'text-secondary'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{accion.icon}</span>
                {accion.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

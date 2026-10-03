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
  onDelete?: () => void;
  /** Click simple en "más opciones". Se ignora si se pasa `menuActions`. */
  onMore?: () => void;
  /** Si se pasa, "más opciones" abre un menú desplegable con estas acciones. */
  menuActions?: ActionsMenuAction[];
}

export const ActionsMenu = ({
  onView,
  onEdit,
  onDelete,
  onMore,
  menuActions,
}: ActionsMenuProps) => {
  const [open, setOpen] = useState(false);
  const hasMenu = !!menuActions && menuActions.length > 0;

  const handleMoreClick = () => {
    if (hasMenu) {
      setOpen((prev) => !prev);
    } else {
      onMore?.();
    }
  };

  return (
    <div className="relative flex items-center gap-3 text-[#44474E]">
      {onView && (
        <button
          type="button"
          onClick={onView}
          title="Ver detalle"
          className="hover:text-secondary cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">visibility</span>
        </button>
      )}
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          title="Editar"
          className="hover:text-secondary cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">edit</span>
        </button>
      )}
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          title="Eliminar"
          className="text-alert cursor-pointer hover:text-[#93000a]"
        >
          <span className="material-symbols-outlined text-[20px]">delete</span>
        </button>
      )}
      {(onMore || hasMenu) && (
        <button
          type="button"
          onClick={handleMoreClick}
          title="Más opciones"
          className="hover:text-secondary cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">more_vert</span>
        </button>
      )}

      {open && hasMenu && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full right-0 z-20 mt-1 w-52 rounded-xl border border-black/10 bg-white py-1 shadow-lg">
            {menuActions.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={() => {
                  action.onClick();
                  setOpen(false);
                }}
                className={`flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm hover:bg-black/5 ${
                  action.tone === 'danger' ? 'text-alert' : 'text-secondary'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

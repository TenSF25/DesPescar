interface ActionsMenuProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onMore?: () => void;
}

export const ActionsMenu = ({ onView, onEdit, onDelete, onMore }: ActionsMenuProps) => {
  return (
    <div className="flex items-center gap-3 text-[#44474E]">
      {onView && (
        <button
          type="button"
          onClick={onView}
          title="Ver detalle"
          className="cursor-pointer hover:text-secondary"
        >
          <span className="material-symbols-outlined text-[20px]">visibility</span>
        </button>
      )}
      {onEdit && (
        <button type="button" onClick={onEdit} title="Editar" className="cursor-pointer hover:text-secondary">
          <span className="material-symbols-outlined text-[20px]">edit</span>
        </button>
      )}
      {onDelete && (
        <button type="button" onClick={onDelete} title="Eliminar" className="text-alert cursor-pointer hover:text-[#93000a]">
          <span className="material-symbols-outlined text-[20px]">delete</span>
        </button>
      )}
      {onMore && (
        <button type="button" onClick={onMore} title="Más opciones" className="cursor-pointer hover:text-secondary">
          <span className="material-symbols-outlined text-[20px]">more_vert</span>
        </button>
      )}
    </div>
  );
};

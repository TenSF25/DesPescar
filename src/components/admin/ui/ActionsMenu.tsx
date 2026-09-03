interface ActionsMenuProps {
  onView?: () => void;
  onEdit?: () => void;
  onMore?: () => void;
}

export const ActionsMenu = ({ onView, onEdit, onMore }: ActionsMenuProps) => {
  return (
    <div className="flex items-center gap-3 text-[#44474E]">
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
      {onMore && (
        <button type="button" onClick={onMore} className="cursor-pointer hover:text-secondary">
          <span className="material-symbols-outlined text-[20px]">more_vert</span>
        </button>
      )}
    </div>
  );
};

import type { ReactNode } from 'react';
import { cn } from '../../../utils/cn';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Modal genérico de admin. Se controla 100% desde afuera con `open`:
 *
 * const [open, setOpen] = useState(false);
 * <Modal open={open} onClose={() => setOpen(false)} title="Agregar vuelo">
 *   ...formulario...
 * </Modal>
 */
export const Modal = ({ open, onClose, title, description, children, className }: ModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div
        className={cn(
          'relative flex max-h-[90vh] w-full max-w-lg flex-col gap-5 overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl',
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-secondary text-xl font-bold">{title}</h2>
            {description && <p className="text-sm text-[#44474E]">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-[#44474E] hover:text-secondary"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {children}
      </div>
    </div>
  );
};

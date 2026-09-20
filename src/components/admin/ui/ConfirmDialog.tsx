import { Modal } from './Modal';
import { Button } from '../../ui/Button';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Diálogo de confirmación para acciones destructivas (eliminar, cancelar).
 *
 * <ConfirmDialog
 *   open={flightToDelete !== null}
 *   title="¿Eliminar este vuelo?"
 *   description="Esta acción no se puede deshacer."
 *   onConfirm={handleConfirmDelete}
 *   onCancel={() => setFlightToDelete(null)}
 * />
 */
export const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = 'Eliminar',
  cancelLabel = 'Cancelar',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  return (
    <Modal open={open} onClose={onCancel} title={title} description={description} className="max-w-sm">
      <div className="flex gap-3">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={loading}>
          {loading ? 'Procesando...' : confirmLabel}
        </Button>
      </div>
    </Modal>
  );
};

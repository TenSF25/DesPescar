import { Button } from '../../../../components/ui/Button';
import { Modal } from '../../../../components/ui/Modal';

interface ConfirmCancelModalProps {
  open: boolean;
  isConfirming: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmCancelModal = ({
  open,
  isConfirming,
  onClose,
  onConfirm,
}: ConfirmCancelModalProps) => {
  return (
    <Modal open={open} title="¿Seguro que querés cancelar?" onClose={onClose}>
      <p className="text-neutral text-[14px]">
        Al cancelar tu vuelo se aplicarán las políticas de la tarifa adquirida. No podrás revertir
        esta acción.
      </p>

      <div className="flex flex-col gap-3 md:flex-row">
        <Button variant="secondary" onClick={onClose} disabled={isConfirming}>
          Volver
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={isConfirming}>
          {isConfirming ? 'Cancelando…' : 'Sí, cancelar vuelo'}
        </Button>
      </div>
    </Modal>
  );
};

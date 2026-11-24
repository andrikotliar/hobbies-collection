import { Button, type ButtonVariant } from '~/shared/components/controls/button';
import { Modal } from './modal';

type ConfirmModalProps<T> = {
  title?: string;
  description?: string;
  data: T | null;
  onConfirm: (data: T) => void;
  onClose: VoidFunction;
  confirmButtonTitle?: string;
  cancelButtonTitle?: string;
  confirmButtonVariant?: ButtonVariant;
  isPending?: boolean;
};

export const ConfirmModal = <T,>({
  title = 'Confirm deleting',
  description,
  data,
  onClose,
  onConfirm,
  confirmButtonTitle = 'Confirm',
  cancelButtonTitle = 'Cancel',
  confirmButtonVariant = 'danger',
  isPending = false,
}: ConfirmModalProps<T>) => {
  const isOpen = data !== null;

  if (!isOpen) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Content size="message">
        <h2 className="text-lg">{title}</h2>
        {description && <p className="text-gray-600 text-sm">{description}</p>}
        <div className="grid grid-cols-2 mt-4 gap-2.5 mb-2.5 last:mb-0">
          <Button
            onClick={() => onConfirm(data)}
            variant={confirmButtonVariant}
            isDisabled={isPending}
          >
            {confirmButtonTitle}
          </Button>
          <Button onClick={onClose} variant="secondary">
            {cancelButtonTitle}
          </Button>
        </div>
      </Modal.Content>
    </Modal>
  );
};

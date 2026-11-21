import { Button, type ButtonVariant } from '~/shared/components/button';
import styles from './styles.module.css';
import { Modal } from '~/shared/components/modal/modal';

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
        <h2 className={styles.title}>{title}</h2>
        {description && <p className={styles.description}>{description}</p>}
        <div className={styles.buttons}>
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

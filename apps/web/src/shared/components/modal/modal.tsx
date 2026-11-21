import { createPortal } from 'react-dom';
import styles from './styles.module.css';
import clsx from 'clsx';
import { BLOCKING_SCROLL_CLASS_NAME } from '~/shared/constants/app';
import { ModalContent } from './components/modal-content/modal-content';
import { ModalCloseButton } from './components/modal-close-button/modal-close-button';

type Props = {
  isOpen: boolean;
  onClose: VoidFunction;
  isAllowedClickOutside?: boolean;
  children: React.ReactNode;
};

export const Modal = ({
  isOpen = false,
  children,
  onClose,
  isAllowedClickOutside = true,
}: Props) => {
  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div
      className={clsx(styles.modal, BLOCKING_SCROLL_CLASS_NAME)}
      onClick={isAllowedClickOutside ? onClose : undefined}
      aria-label="Close modal window"
    >
      {children}
    </div>,
    document.body,
  );
};

Modal.Content = ModalContent;
Modal.CloseButton = ModalCloseButton;

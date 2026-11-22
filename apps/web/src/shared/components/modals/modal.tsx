import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { BLOCKING_SCROLL_CLASS_NAME } from '~/shared/constants/app';
import { ModalContent } from './modal-content';
import { ModalCloseButton } from './modal-close-button';

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
      className={clsx(
        'fixed flex items-center justify-center top-0 left-0 w-full h-full z-1000 p-7.5 bg-black/80 overflow-hidden',
        BLOCKING_SCROLL_CLASS_NAME,
      )}
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

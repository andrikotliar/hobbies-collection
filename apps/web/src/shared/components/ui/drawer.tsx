import clsx from 'clsx';
import { XIcon } from 'lucide-react';
import { createPortal } from 'react-dom';
import { BLOCKING_SCROLL_CLASS_NAME } from '~/shared/constants/app';
import { useDrawer } from '~/shared/hooks/use-drawer';

type Position = 'left' | 'right';

type Props = {
  children: React.ReactNode;
  /**
   * @default 1080
   */
  maxWidth?: number;
  isOpen: boolean;
  position?: Position;
  onClose: VoidFunction;
};

export const Drawer = ({
  children,
  maxWidth = 1080,
  isOpen,
  onClose,
  position = 'right',
}: Props) => {
  const {
    drawerRef,
    handleClose,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleMouseLeave,
    handleTouchStart,
    handleTouchMove,
  } = useDrawer({ closeHandler: onClose, position });

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div
      className={clsx(
        'fixed top-0 overflow-y-auto w-full h-screen bg-white shadow-sm z-202 select-none',
        position === 'left' ? 'left-0' : 'right-0',
        BLOCKING_SCROLL_CLASS_NAME,
      )}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleMouseUp}
      onTouchMove={handleTouchMove}
      ref={drawerRef}
      style={{ maxWidth }}
    >
      <div className="sticky top-0 z-200 h-0">
        <button
          className="flex items-center justify-center bg-white rounded-bl-xl ml-auto size-7 cursor-pointer"
          onClick={handleClose}
        >
          <XIcon />
        </button>
      </div>
      {children}
    </div>,
    document.body,
  );
};

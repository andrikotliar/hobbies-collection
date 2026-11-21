import clsx from 'clsx';
import styles from './styles.module.css';
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
  textColor?: 'white' | 'black';
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
      className={clsx(styles.drawer_wrapper, styles[position], BLOCKING_SCROLL_CLASS_NAME)}
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
      <div className={styles.close_button_holder}>
        <button className={styles.close_button} onClick={handleClose}>
          <XIcon />
        </button>
      </div>
      {children}
    </div>,
    document.body,
  );
};

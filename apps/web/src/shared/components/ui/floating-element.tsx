import clsx from 'clsx';
import { useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useCloseOnEscape } from '~/shared/hooks/use-close-on-escape';
import { useFocusTrap } from '~/shared/hooks/use-focus-trap';
import { useClickOutside } from '~/shared/hooks/use-click-outside';
import { useResizeObserver } from '~/shared/hooks/use-resize-observer';

type Styles = {
  left: number;
  top?: number;
  bottom?: number;
  width?: number;
};

type MenuPositionOptions = {
  menuElement: HTMLDivElement | null;
  triggerElement: HTMLElement | null;
  menuMargin: number;
  shouldAdjustToTriggerWidth: boolean;
  isFixed: boolean;
};

type Props = {
  isOpen: boolean;
  triggerRef: React.RefObject<HTMLElement | null>;
  /**
   * Defines from where calculate position depending on triggerRef
   * @default left
   */
  /**
   * Top offset from the trigger
   */
  menuMargin?: number;
  /**
   * Define the element position on the page
   * * scroll - the element follow the page scroll
   * * fixed - the element keeps its position on the page
   * @default scroll
   */
  positionState?: 'scroll' | 'fixed';
  shouldAdjustToTriggerWidth?: boolean;
  shouldFocusTriggerOnClose?: boolean;
  onClose: VoidFunction;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const DEFAULT_MENU_MARGIN_PX = 10;

const updateMenuPosition = ({
  menuElement,
  triggerElement,
  menuMargin,
  shouldAdjustToTriggerWidth,
  isFixed,
}: MenuPositionOptions): Styles => {
  if (!menuElement || !triggerElement) {
    return {
      left: 0,
      top: 0,
    };
  }

  const { height: menuHeight, width: menuWidth } = menuElement.getBoundingClientRect();

  const {
    left,
    bottom,
    top,
    width: buttonWidth,
    right: buttonRight,
  } = triggerElement.getBoundingClientRect();

  const isOverflowBottom = bottom + menuHeight >= window.innerHeight;
  const isOverflowRight = left + menuWidth >= window.innerWidth;
  const isOverflowTop = top - menuHeight <= 0;

  const scrollHight = isFixed ? 0 : window.scrollY;

  const params: Styles = {
    left: isOverflowRight ? buttonRight - menuWidth : left,
  };

  if (shouldAdjustToTriggerWidth) {
    params.width = buttonWidth;
  }

  if (isOverflowBottom && !isOverflowTop && !isFixed) {
    params.bottom = document.body.scrollHeight - top + menuMargin - scrollHight;
  } else {
    params.top = bottom + menuMargin + scrollHight;
  }

  return params;
};

const setPosition = (menuElem: HTMLDivElement | null, styles: Styles) => {
  if (!menuElem) {
    return;
  }

  if (styles.width) {
    menuElem.style.width = styles.width + 'px';
  }

  if (styles.top) {
    menuElem.style.top = styles.top + 'px';
    menuElem.style.bottom = '';
  }

  if (styles.bottom) {
    menuElem.style.bottom = styles.bottom + 'px';
    menuElem.style.top = '';
  }

  menuElem.style.left = styles.left + 'px';
};

export const FloatingElement = ({
  triggerRef,
  menuMargin = DEFAULT_MENU_MARGIN_PX,
  className,
  children,
  isOpen,
  shouldAdjustToTriggerWidth = false,
  shouldFocusTriggerOnClose = false,
  onClose,
  positionState = 'scroll',
  ...divProps
}: Props) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    setPosition(
      menuRef.current,
      updateMenuPosition({
        menuElement: menuRef.current,
        triggerElement: triggerRef.current,
        menuMargin,
        shouldAdjustToTriggerWidth,
        isFixed: positionState === 'fixed',
      }),
    );
  }, []);

  useCloseOnEscape(isOpen, onClose);

  useFocusTrap({
    container: menuRef.current,
    trigger: triggerRef.current,
    isOpen,
    shouldFocusOnClose: shouldFocusTriggerOnClose,
  });

  useClickOutside({
    isOpen,
    closeHandler: onClose,
    triggerElementRef: triggerRef,
    containerRef: menuRef,
  });

  const resizeObserver = () => {
    setPosition(
      menuRef.current,
      updateMenuPosition({
        menuElement: menuRef.current,
        triggerElement: triggerRef.current,
        menuMargin,
        shouldAdjustToTriggerWidth,
        isFixed: positionState === 'fixed',
      }),
    );
  };

  useResizeObserver(resizeObserver, document.body);

  return createPortal(
    <div
      ref={menuRef}
      className={clsx(
        positionState === 'fixed' ? 'fixed' : 'absolute',
        'bg-white rounded-lg shadow-sm border border-slate-300 min-w-37 z-1100',
        className,
      )}
      {...divProps}
    >
      {children}
    </div>,
    document.body,
  );
};

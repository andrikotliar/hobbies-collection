import styles from './styles.module.css';
import clsx from 'clsx';
import { Loader } from '~/shared/components/loader/loader';
import { defineCssProperties } from '~/shared/helpers/define-css-properties';
import { XIcon } from 'lucide-react';
import { BLOCKING_SCROLL_CLASS_NAME } from '~/shared/constants/app';

type Props = {
  isOpen: boolean;
  onToggle: () => void;
  isLoading?: boolean;
  heightReducer?: `${string}px`;
  topPositionMargin?: `${string}px`;
  children?: React.ReactNode;
};

export const FiltersSidebar = ({
  isOpen,
  onToggle,
  isLoading = false,
  heightReducer = '0px',
  topPositionMargin = '0px',
  children,
}: Props) => {
  if (isLoading) {
    return (
      <div className={styles.sidebar_content}>
        <Loader />
      </div>
    );
  }

  return (
    <div
      className={clsx(styles.sidebar_content, {
        [styles.open]: isOpen,
        [BLOCKING_SCROLL_CLASS_NAME]: isOpen,
      })}
      style={defineCssProperties({
        '--sidebar-height-reducer': heightReducer,
        '--sidebar-top-position-margin': topPositionMargin,
      })}
    >
      {children}
      <button onClick={onToggle} className={styles.close_icon_wrapper}>
        <XIcon />
      </button>
    </div>
  );
};

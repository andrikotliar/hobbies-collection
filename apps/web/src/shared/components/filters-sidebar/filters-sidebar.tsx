import styles from './filters-sidebar.module.css';
import clsx from 'clsx';
import type z from 'zod';
import { Loader } from '~/shared/components/loader/loader';
import { defineCssProperties } from '~/shared/helpers';
import { XIcon } from 'lucide-react';
import { BLOCKING_SCROLL_CLASS_NAME } from '~/shared/constants';
import { Filters, type FiltersProps } from './components';

type SidebarProps<TDefaultValues extends Record<string, unknown>, TSchema extends z.ZodType> = {
  isOpen: boolean;
  onToggle: () => void;
  isLoading?: boolean;
  heightReducer?: `${string}px`;
  topPositionMargin?: `${string}px`;
} & FiltersProps<TDefaultValues, TSchema>;

export const FiltersSidebar = <
  TDefaultValues extends Record<string, unknown>,
  TSchema extends z.ZodType,
>({
  isOpen,
  onToggle,
  isLoading = false,
  heightReducer = '0px',
  topPositionMargin = '0px',
  ...props
}: SidebarProps<TDefaultValues, TSchema>) => {
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
      <Filters {...props} />
      <button onClick={onToggle} className={styles.close_icon_wrapper}>
        <XIcon />
      </button>
    </div>
  );
};

import { type ComponentProps } from 'react';
import styles from './page-layout.module.css';
import clsx from 'clsx';

type PageLayoutProps = ComponentProps<'div'>;

export const PageLayout = ({ children, className, ...rest }: PageLayoutProps) => {
  return (
    <div {...rest} className={clsx(styles.page_layout, className)}>
      {children}
    </div>
  );
};

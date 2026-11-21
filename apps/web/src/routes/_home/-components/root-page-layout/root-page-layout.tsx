import styles from './styles.module.css';
import clsx from 'clsx';

export const RootPageLayout = ({ children, className, ...rest }: React.ComponentProps<'div'>) => {
  return (
    <div {...rest} className={clsx(styles.root_page_layout, className)}>
      {children}
    </div>
  );
};

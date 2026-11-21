import styles from './styles.module.css';
import clsx from 'clsx';

type Props = {
  className?: string;
  children: React.ReactNode;
};

export const PageTitle = ({ children, className }: Props) => {
  return <h1 className={clsx(styles.page_title, className)}>{children}</h1>;
};

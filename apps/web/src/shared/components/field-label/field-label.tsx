import styles from './styles.module.css';
import clsx from 'clsx';

type Props = {
  children: React.ReactNode;
  className?: string;
};

export const FieldLabel = ({ children, className }: Props) => {
  return <span className={clsx(styles.label, className)}>{children}</span>;
};

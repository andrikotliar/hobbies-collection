import clsx from 'clsx';
import { Link, type LinkProps } from '@tanstack/react-router';
import styles from './styles.module.css';

type Props = {
  className?: string;
} & LinkProps;

export const RouterLink = ({ children, className, ...props }: Props) => {
  return (
    <Link className={clsx(styles.link, className)} {...props}>
      {children}
    </Link>
  );
};

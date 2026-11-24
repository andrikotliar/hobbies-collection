import clsx from 'clsx';
import { Link, type LinkProps } from '@tanstack/react-router';

type Props = {
  className?: string;
} & LinkProps;

export const RouterLink = ({ children, className, ...props }: Props) => {
  return (
    <Link
      className={clsx(
        'text-sky-600 transition-colors [-webkit-user-drag:none] hover:underline',
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
};

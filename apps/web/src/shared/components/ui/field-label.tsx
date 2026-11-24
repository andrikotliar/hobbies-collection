import clsx from 'clsx';

type Props = {
  children: React.ReactNode;
  className?: string;
};

export const FieldLabel = ({ children, className }: Props) => {
  return (
    <span className={clsx('text-gray-600 text-sm font-bold select-none', className)}>
      {children}
    </span>
  );
};

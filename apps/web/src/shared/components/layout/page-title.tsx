import clsx from 'clsx';

type Props = {
  className?: string;
  children: React.ReactNode;
};

export const PageTitle = ({ children, className }: Props) => {
  return (
    <h1 className={clsx('text-2xl sm:text-3xl font-bold font-stretch-condensed', className)}>
      {children}
    </h1>
  );
};

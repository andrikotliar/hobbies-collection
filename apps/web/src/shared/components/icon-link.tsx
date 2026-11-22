import { Link, type LinkProps } from '@tanstack/react-router';

type Props = Omit<LinkProps, 'className' | 'children'> & {
  icon: React.ReactNode;
};

export const IconLink = ({ icon, ...props }: Props) => {
  return (
    <Link className="text-black flex items-center justify-center hover:text-sky-600" {...props}>
      {icon}
    </Link>
  );
};

import { ArrowLeftIcon } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import type { FileRoutesByTo } from '~/routeTree.gen';

type Props = {
  path: keyof FileRoutesByTo;
  children: React.ReactNode;
  search?: Record<string, any>;
};

export const BackLink = ({ path, children, search }: Props) => {
  return (
    <Link to={path} className="flex items-center gap-1" search={search}>
      <ArrowLeftIcon />
      <span>{children}</span>
    </Link>
  );
};

import { Link, useLocation } from '@tanstack/react-router';
import type { FileRoutesByTo } from '~/routeTree.gen';
import clsx from 'clsx';

type NavItem = {
  to: keyof FileRoutesByTo;
  title: string;
};

const links: NavItem[] = [
  {
    to: '/',
    title: 'Films Collection',
  },
  {
    to: '/films/stats',
    title: 'Films Statistic',
  },
];

export const Navigation = () => {
  const location = useLocation();

  return (
    <div className="w-full xl:w-fit flex items-center uppercase font-stretch-condensed">
      {links.map((link) => (
        <Link
          to={link.to}
          key={link.to}
          className={clsx(
            'flex grow text-xs xl:grow-0 items-center justify-center lg:text-base gap-1 text-sky-600 transition-colors text-center h-11 w-50 border border-sky-600 first:rounded-tl-lg first:rounded-bl-lg last:rounded-tr-lg last:rounded-br-lg',
            location.pathname === link.to ? 'bg-sky-600 text-white' : 'hover:bg-sky-100 bg-white',
          )}
        >
          {link.title}
        </Link>
      ))}
    </div>
  );
};

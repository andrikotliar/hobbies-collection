import { Link, useLocation } from '@tanstack/react-router';
import styles from './navigation.module.css';
import type { FileRoutesByTo } from '~/routeTree.gen';
import clsx from 'clsx';
import { ChartPieIcon, FilmIcon } from 'lucide-react';

type NavItem = {
  to: keyof FileRoutesByTo;
  title: string;
  icon: React.ReactNode;
};

const links: NavItem[] = [
  {
    to: '/films',
    title: 'Collection',
    icon: <FilmIcon />,
  },
  {
    to: '/films/stats',
    title: 'Statistic',
    icon: <ChartPieIcon />,
  },
];

export const Navigation = () => {
  const location = useLocation();

  return (
    <div className={styles.wrapper}>
      {links.map((link) => (
        <Link
          to={link.to}
          key={link.to}
          className={clsx(styles.link, location.pathname === link.to && styles.link_active)}
        >
          {link.icon}
          <span>{link.title}</span>
        </Link>
      ))}
    </div>
  );
};

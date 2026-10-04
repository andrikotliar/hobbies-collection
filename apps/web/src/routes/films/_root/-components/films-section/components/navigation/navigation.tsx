import { Link, useLocation } from '@tanstack/react-router';
import styles from './navigation.module.css';
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
    <div className={styles.wrapper}>
      {links.map((link) => (
        <Link
          to={link.to}
          key={link.to}
          className={clsx(styles.link, location.pathname === link.to && styles.link_active)}
        >
          {link.title}
        </Link>
      ))}
    </div>
  );
};

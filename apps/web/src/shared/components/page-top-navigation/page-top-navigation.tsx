import { Link, useLocation } from '@tanstack/react-router';
import styles from './page-top-navigation.module.css';
import type { FileRoutesByTo } from '~/routeTree.gen';
import clsx from 'clsx';

export type PageTopNavigationNavItem = {
  to: keyof FileRoutesByTo;
  title: string;
  icon: React.ReactNode;
};

type PageTopNavigation = {
  links: PageTopNavigationNavItem[];
};

export const PageTopNavigation = ({ links }: PageTopNavigation) => {
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

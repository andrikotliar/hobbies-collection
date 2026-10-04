import { Link, useLocation, type ParsedLocation } from '@tanstack/react-router';
import styles from './page-top-navigation.module.css';
import type { FileRoutesByTo } from '~/routeTree.gen';
import clsx from 'clsx';

export type PageTopNavigationNavItem = {
  to: keyof FileRoutesByTo;
  title: string;
  icon: React.ReactNode;
  isActive?: boolean;
};

type PageTopNavigation = {
  getLinks: (location: ParsedLocation) => PageTopNavigationNavItem[];
};

export const PageTopNavigation = ({ getLinks }: PageTopNavigation) => {
  const location = useLocation();

  return (
    <div className={styles.wrapper}>
      {getLinks(location).map((link) => (
        <Link
          to={link.to}
          key={link.to}
          className={clsx(styles.link, {
            [styles.link_active]: location.pathname === link.to || link.isActive,
          })}
        >
          {link.icon}
          <span>{link.title}</span>
        </Link>
      ))}
    </div>
  );
};

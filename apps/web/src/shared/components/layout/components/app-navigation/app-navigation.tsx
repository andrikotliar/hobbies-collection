import { useQueryClient } from '@tanstack/react-query';
import styles from './app-navigation.module.css';
import { Link, useLocation, useNavigate, type ParsedLocation } from '@tanstack/react-router';
import clsx from 'clsx';
import {
  BookIcon,
  ClapperboardIcon,
  InfoIcon,
  LogOutIcon,
  PlayingCardsFanIcon,
  SettingsIcon,
} from 'lucide-react';
import { Logo } from '~/shared/components/logo/logo';
import { api, queryKey } from '~/shared/services';
import type { NavLink } from '~/shared/types';

const getNavigationConfig = (location: ParsedLocation): NavLink[] => [
  {
    id: 'films',
    icon: <ClapperboardIcon className={styles.navigation_item_icon} />,
    title: 'Films',
    path: '/films',
    isActive: location.pathname.includes('films') && !location.pathname.includes('console'),
  },
  {
    id: 'books',
    icon: <BookIcon className={styles.navigation_item_icon} />,
    title: 'Books',
    path: '/books',
  },
  {
    id: 'board-games',
    icon: <PlayingCardsFanIcon className={styles.navigation_item_icon} />,
    title: 'BG',
    path: '/board-games',
  },
  {
    id: 'about',
    icon: <InfoIcon className={styles.navigation_item_icon} />,
    title: 'About',
    path: '/about',
  },
];

export const AppNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logout = async () => {
    await api.auth.logout();
    queryClient.removeQueries({ queryKey: queryKey('auth.getState') });
    navigate({ to: '/login' });
  };

  return (
    <div className={styles.app_navigation_layout}>
      <div className={styles.inner}>
        <div className={styles.desktop_logo}>
          <Logo size={40} />
        </div>
        {getNavigationConfig(location).map((link) => (
          <Link
            to={link.path}
            key={link.id}
            className={clsx(styles.navigation_item, {
              [styles.navigation_item_active]: location.pathname === link.path || link.isActive,
            })}
          >
            {link.icon}
            <span className={styles.navigation_item_title}>{link.title}</span>
          </Link>
        ))}
        {location.pathname.includes('/console') ? (
          <button className={clsx(styles.navigation_item, styles.bottom_item)} onClick={logout}>
            <LogOutIcon className={styles.navigation_item_icon} />
            <span className={styles.navigation_item_title}>Log Out</span>
          </button>
        ) : (
          <Link
            to="/console"
            className={clsx(
              styles.navigation_item,
              styles.bottom_item,
              location.pathname.includes('/console') && styles.navigation_item_active,
            )}
          >
            <SettingsIcon className={styles.navigation_item_icon} />
            <span className={styles.navigation_item_title}>Console</span>
          </Link>
        )}
      </div>
    </div>
  );
};

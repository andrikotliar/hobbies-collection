import { useMutation, useQueryClient } from '@tanstack/react-query';
import styles from './styles.module.css';
import { Link, useLocation, useNavigate, type ParsedLocation } from '@tanstack/react-router';
import clsx from 'clsx';
import {
  BookIcon,
  ClapperboardIcon,
  LogOutIcon,
  PlayingCardsFanIcon,
  SettingsIcon,
} from 'lucide-react';
import { Logo } from '~/shared/components/logo';
import { api, queryKey } from '~/shared/services/api';
import type { NavLink } from '~/shared/types/nav-link';
import { useState } from 'react';
import { ConfirmModal } from '~/shared/components/confirm-modal';

const getNavigationConfig = (location: ParsedLocation): NavLink[] => [
  {
    id: 'films',
    icon: <ClapperboardIcon className={styles.navigation_item_icon} />,
    title: 'Films',
    path: '/',
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
];

export const AppNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [logoutData, setLogoutData] = useState<{
    open: boolean;
  } | null>(null);

  const logout = useMutation({
    mutationFn: api.auth.logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: queryKey('auth.getState') });
      navigate({ to: '/login' });
      setLogoutData(null);
    },
  });

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
          <button
            className={clsx(styles.navigation_item, styles.bottom_item)}
            onClick={() => setLogoutData({ open: true })}
          >
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
      <ConfirmModal
        onClose={() => setLogoutData(null)}
        title="Confirm logout?"
        data={logoutData}
        onConfirm={() => logout.mutate()}
        isPending={logout.isPending}
      />
    </div>
  );
};

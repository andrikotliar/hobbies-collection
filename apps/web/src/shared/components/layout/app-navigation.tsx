import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useLocation, useNavigate, type ParsedLocation } from '@tanstack/react-router';
import clsx from 'clsx';
import {
  BookIcon,
  ClapperboardIcon,
  LogOutIcon,
  PlayingCardsFanIcon,
  SettingsIcon,
} from 'lucide-react';
import { Logo } from '~/shared/components/ui/logo';
import { api, queryKey } from '~/shared/services/api';
import type { NavLink } from '~/shared/types/nav-link';
import { useState } from 'react';
import { ConfirmModal } from '~/shared/components/modals/confirm-modal';

const navigationItemClassName = clsx(
  'w-full md:w-10 shrink-0 flex flex-col items-center justify-center gap-1 hover:text-sky-600',
);
const activeItemClassName = clsx('text-sky-600 pointer-events-none');
const itemTitleClassName = clsx('hidden md:block text-xs uppercase');
const bottomItemClassName = clsx('md:mt-auto');
const iconClassName = clsx('size-6 md:size-7.5');

const getNavigationConfig = (location: ParsedLocation): NavLink[] => [
  {
    id: 'films',
    icon: <ClapperboardIcon className={iconClassName} />,
    title: 'Films',
    path: '/',
    isActive: location.pathname.includes('films') && !location.pathname.includes('console'),
  },
  {
    id: 'books',
    icon: <BookIcon className={iconClassName} />,
    title: 'Books',
    path: '/books',
  },
  {
    id: 'board-games',
    icon: <PlayingCardsFanIcon className={iconClassName} />,
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
    <div className="fixed w-full h-15 bottom-0 px-5 items-center border-t border-t-slate-300 flex justify-center md:sticky md:bottom-auto bg-white md:border-r md:border-r-slate-300 md:border-top-0 z-200 md:w-15 shrink-0 md:h-dvh md:px-0 md:py-5">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(20px,1fr))] gap-4 w-full max-w-100 mx-auto md:flex md:flex-col md:gap-10">
        <div className="hidden md:flex mx-auto mb-5">
          <Logo size={40} />
        </div>
        {getNavigationConfig(location).map((link) => (
          <Link
            to={link.path}
            key={link.id}
            className={clsx(navigationItemClassName, {
              [activeItemClassName]: location.pathname === link.path || link.isActive,
            })}
          >
            {link.icon}
            <span className={itemTitleClassName}>{link.title}</span>
          </Link>
        ))}
        {location.pathname.includes('/console') ? (
          <button
            className={clsx(navigationItemClassName, bottomItemClassName)}
            onClick={() => setLogoutData({ open: true })}
          >
            <LogOutIcon className={iconClassName} />
            <span className={itemTitleClassName}>Log Out</span>
          </button>
        ) : (
          <Link
            to="/console"
            className={clsx(
              navigationItemClassName,
              bottomItemClassName,
              location.pathname.includes('/console') && activeItemClassName,
            )}
          >
            <SettingsIcon className={iconClassName} />
            <span className={itemTitleClassName}>Console</span>
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

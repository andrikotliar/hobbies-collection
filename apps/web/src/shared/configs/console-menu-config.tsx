import {
  BuildingIcon,
  CalendarClockIcon,
  CalendarIcon,
  ClapperboardIcon,
  ClockIcon,
  DicesIcon,
  KeyRoundIcon,
  LibraryIcon,
  MapIcon,
  TrophyIcon,
  UserCogIcon,
  UserIcon,
  VideotapeIcon,
} from 'lucide-react';
import { DraftLevel } from '@hobbies-collection/shared';
import type { MenuConfigItem } from '~/shared/types/menu-config-item';
import clsx from 'clsx';

export const consoleMenuConfig: Record<string, MenuConfigItem> = {
  films: {
    id: 'films',
    route: '/console/films',
    title: 'Films',
    icon: <ClapperboardIcon />,
    bg: clsx('from-sky-600 to-sky-400'),
    color: clsx('text-sky-600 hover:border-sky-600 hover:bg-sky-100'),
  },
  pendingFilms: {
    id: 'pendingFilms',
    route: '/console/films',
    search: {
      draftLevels: [DraftLevel.PENDING],
      order: 'asc' as const,
      orderKey: 'createdAt',
    },
    title: 'Pending Films',
    shortTitle: 'Pending',
    icon: <CalendarClockIcon />,
    bg: clsx('from-orange-400 to-orange-300'),
    color: clsx('text-orange-600 hover:border-orange-600 hover:bg-orange-100'),
  },
  upcomingFilms: {
    id: 'upcomingFilms',
    route: '/console/films',
    title: 'Upcoming Films',
    shortTitle: 'Upcoming',
    search: {
      draftLevels: [DraftLevel.UPCOMING],
    },
    icon: <ClockIcon />,
    bg: clsx('from-amber-800 to-amber-600'),
    color: clsx('text-amber-800 hover:border-amber-800 hover:bg-amber-50'),
  },
  collectionEvents: {
    id: 'collection-events',
    route: '/console/collection-events',
    title: 'Collection Events',
    shortTitle: 'Events',
    icon: <CalendarIcon />,
    bg: clsx('from-amber-400 to-amber-300'),
    color: clsx('text-amber-400 hover:border-amber-400 hover:bg-amber-50'),
  },
  awards: {
    id: 'awards',
    route: '/console/awards',
    title: 'Awards',
    icon: <TrophyIcon />,
    bg: clsx('from-yellow-400 to-yellow-300'),
    color: clsx('text-yellow-400 hover:border-yellow-400 hover:bg-yellow-50'),
  },
  collections: {
    id: 'collections',
    route: '/console/collections',
    title: 'Collections',
    icon: <LibraryIcon />,
    bg: clsx('from-red-400 to-red-200'),
    color: clsx('text-red-400 hover:border-red-400 hover:bg-red-50'),
  },
  countries: {
    id: 'countries',
    route: '/console/countries',
    title: 'Countries',
    icon: <MapIcon />,
    bg: clsx('from-teal-400 to-teal-300'),
    color: clsx('text-teal-400 hover:border-teal-400 hover:bg-teal-50'),
  },
  genres: {
    id: 'genres',
    route: '/console/genres',
    title: 'Genres',
    icon: <VideotapeIcon />,
    bg: clsx('from-indigo-600 to-indigo-400'),
    color: clsx('text-indigo-600 hover:border-indigo-600 hover:bg-indigo-100'),
  },
  studios: {
    id: 'studios',
    route: '/console/studios',
    title: 'Studios',
    icon: <BuildingIcon />,
    bg: clsx('from-rose-600 to-rose-400'),
    color: clsx('text-rose-600 hover:border-rose-600 hover:bg-rose-100'),
  },
  people: {
    id: 'people',
    route: '/console/people',
    title: 'Actors / Creators',
    shortTitle: 'People',
    icon: <UserIcon />,
    bg: clsx('from-cyan-600 to-cyan-400'),
    color: clsx('text-cyan-600 hover:border-cyan-600 hover:bg-cyan-100'),
  },
  hobbies: {
    id: 'hobbies',
    route: '/console/hobbies',
    title: 'Hobbies',
    icon: <DicesIcon />,
    bg: clsx('from-fuchsia-600 to-fuchsia-400'),
    color: clsx('text-fuchsia-600 hover:border-fuchsia-600 hover:bg-fuchsia-100'),
  },
  sessions: {
    id: 'sessions',
    route: '/console/sessions',
    title: 'Sessions',
    icon: <KeyRoundIcon />,
    bg: clsx('from-purple-600 to-purple-400'),
    color: clsx('text-purple-600 hover:border-purple-600 hover:bg-purple-100'),
  },
  user: {
    id: 'user',
    route: '/console/user',
    title: 'User',
    icon: <UserCogIcon />,
    bg: clsx('from-lime-600 to-lime-400'),
    color: clsx('text-lime-600 hover:border-lime-600 hover:bg-lime-100'),
  },
};

type ConsoleMenuGroup = {
  title: string;
  itemIds: (keyof typeof consoleMenuConfig)[];
};

export const consoleMenuGroups: ConsoleMenuGroup[] = [
  {
    title: 'Films',
    itemIds: ['films', 'pendingFilms', 'upcomingFilms'],
  },
  {
    title: 'Base info',
    itemIds: ['awards', 'genres', 'collections', 'countries', 'studios', 'people'],
  },
  {
    title: 'Content',
    itemIds: ['collectionEvents', 'hobbies'],
  },
  {
    title: 'Account',
    itemIds: ['sessions', 'user'],
  },
];

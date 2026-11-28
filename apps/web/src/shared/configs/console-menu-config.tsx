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

export const consoleMenuConfig: Record<string, MenuConfigItem> = {
  films: {
    id: 'films',
    route: '/console/films',
    title: 'Films',
    icon: <ClapperboardIcon />,
    color: 'var(--color-sky-600)',
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
    color: 'var(--color-orange-500)',
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
    color: 'var(--color-amber-800)',
  },
  collectionEvents: {
    id: 'collection-events',
    route: '/console/collection-events',
    title: 'Collection Events',
    shortTitle: 'Events',
    icon: <CalendarIcon />,
    color: 'var(--color-amber-400)',
  },
  awards: {
    id: 'awards',
    route: '/console/awards',
    title: 'Awards',
    icon: <TrophyIcon />,
    color: 'var(--color-yellow-400)',
  },
  collections: {
    id: 'collections',
    route: '/console/collections',
    title: 'Collections',
    icon: <LibraryIcon />,
    color: 'var(--color-red-400)',
  },
  countries: {
    id: 'countries',
    route: '/console/countries',
    title: 'Countries',
    icon: <MapIcon />,
    color: 'var(--color-teal-400)',
  },
  genres: {
    id: 'genres',
    route: '/console/genres',
    title: 'Genres',
    icon: <VideotapeIcon />,
    color: 'var(--color-indigo-400)',
  },
  studios: {
    id: 'studios',
    route: '/console/studios',
    title: 'Studios',
    icon: <BuildingIcon />,
    color: 'var(--color-rose-400)',
  },
  people: {
    id: 'people',
    route: '/console/people',
    title: 'Actors / Creators',
    shortTitle: 'People',
    icon: <UserIcon />,
    color: 'var(--color-cyan-600)',
  },
  hobbies: {
    id: 'hobbies',
    route: '/console/hobbies',
    title: 'Hobbies',
    icon: <DicesIcon />,
    color: 'var(--color-fuchsia-700)',
  },
  sessions: {
    id: 'sessions',
    route: '/console/sessions',
    title: 'Sessions',
    icon: <KeyRoundIcon />,
    color: 'var(--color-purple-400)',
  },
  user: {
    id: 'user',
    route: '/console/user',
    title: 'User',
    icon: <UserCogIcon />,
    color: 'var(--color-lime-400)',
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

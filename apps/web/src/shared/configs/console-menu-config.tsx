import { type MenuConfigItem } from '../types';
import {
  BuildingIcon,
  CalendarClockIcon,
  CalendarIcon,
  ClapperboardIcon,
  ClockIcon,
  KeyRoundIcon,
  LibraryIcon,
  MapIcon,
  NewspaperIcon,
  TrophyIcon,
  UserCogIcon,
  UserIcon,
  VideotapeIcon,
} from 'lucide-react';
import { DraftLevel } from '@hobbies-collection/shared';

export const consoleMenuConfig: Record<string, MenuConfigItem> = {
  films: {
    id: 'films',
    route: '/console/films',
    title: 'Films',
    icon: <ClapperboardIcon />,
    color: 'colorBluePrimary',
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
    color: 'colorOrangePrimary',
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
    color: 'colorBrownLight',
  },
  collectionEvents: {
    id: 'collection-events',
    route: '/console/collection-events',
    title: 'Collection Events',
    shortTitle: 'Events',
    icon: <CalendarIcon />,
    color: 'colorOrangeLight',
  },
  awards: {
    id: 'awards',
    route: '/console/awards',
    title: 'Awards',
    icon: <TrophyIcon />,
    color: 'colorYellowPrimary',
  },
  collections: {
    id: 'collections',
    route: '/console/collections',
    title: 'Collections',
    icon: <LibraryIcon />,
    color: 'colorRedLight',
  },
  countries: {
    id: 'countries',
    route: '/console/countries',
    title: 'Countries',
    icon: <MapIcon />,
    color: 'colorGreenPrimary',
  },
  genres: {
    id: 'genres',
    route: '/console/genres',
    title: 'Genres',
    icon: <VideotapeIcon />,
    color: 'colorPurplePrimary',
  },
  articles: {
    id: 'articles',
    route: '/console/articles',
    title: 'Articles',
    icon: <NewspaperIcon />,
    color: 'colorGreenDark',
  },
  studios: {
    id: 'studios',
    route: '/console/studios',
    title: 'Studios',
    icon: <BuildingIcon />,
    color: 'colorGrayDark',
  },
  people: {
    id: 'people',
    route: '/console/people',
    title: 'Actors / Creators',
    shortTitle: 'People',
    icon: <UserIcon />,
    color: 'colorBlueDark',
  },
  sessions: {
    id: 'sessions',
    route: '/console/sessions',
    title: 'Sessions',
    icon: <KeyRoundIcon />,
    color: 'colorPurpleLight',
  },
  user: {
    id: 'user',
    route: '/console/user',
    title: 'User',
    icon: <UserCogIcon />,
    color: 'colorLimePrimary',
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
    itemIds: ['collectionEvents', 'articles'],
  },
  {
    title: 'Account',
    itemIds: ['sessions', 'user'],
  },
];

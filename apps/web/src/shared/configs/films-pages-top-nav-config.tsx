import type { ParsedLocation } from '@tanstack/react-router';
import { ChartPieIcon, FilmIcon } from 'lucide-react';
import type { PageTopNavigationNavItem } from '~/shared/components';

export const getFilmsPagesTopNavConfig = (location: ParsedLocation): PageTopNavigationNavItem[] => [
  {
    to: '/films',
    title: 'Collection',
    icon: <FilmIcon />,
    isActive: location.pathname.includes('films') && !location.pathname.includes('stats'),
  },
  {
    to: '/films/stats',
    title: 'Statistic',
    icon: <ChartPieIcon />,
  },
];

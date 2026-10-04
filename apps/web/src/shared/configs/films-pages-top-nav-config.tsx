import { ChartPieIcon, FilmIcon } from 'lucide-react';
import type { PageTopNavigationNavItem } from '~/shared/components';

export const filmsPagesTopNavConfig: PageTopNavigationNavItem[] = [
  {
    to: '/films',
    title: 'Collection',
    icon: <FilmIcon />,
  },
  {
    to: '/films/stats',
    title: 'Statistic',
    icon: <ChartPieIcon />,
  },
];

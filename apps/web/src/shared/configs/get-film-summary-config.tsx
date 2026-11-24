import {
  BookIcon,
  BuildingIcon,
  CalendarIcon,
  ClockIcon,
  GlobeIcon,
  HandCoinsIcon,
  TvIcon,
  WalletIcon,
} from 'lucide-react';
import { getFormattedMoneyValue } from '@hobbies-collection/shared';
import type { ApiResponse } from '~/shared/types/extract-params';
import type { api } from '~/shared/services/api';
import { getPluralWord } from '~/shared/helpers/get-plural-word';
import { LinksGroup } from '../components/layout/links-group';
import { ReleaseDate } from '../components/drawers/film/film-drawer-release-date';
import { DataLink } from '../components/links/data-link';
import { LinksGroupWrapper } from '../components/layout/links-group-wrapper';

export type SummaryConfig = {
  id: string;
  title: string;
  content: React.ReactNode;
  icon: React.ReactNode;
  isHidden?: boolean;
};

const isSeries = (film: ApiResponse<typeof api.films.getById>) => {
  return film.type === 'SERIES' || film.type === 'ANIMATED_SERIES';
};

export const getFilmSummaryConfig = (
  film: ApiResponse<typeof api.films.getById>,
): SummaryConfig[] => {
  const values: SummaryConfig[] = [
    {
      id: 'genres',
      title: 'Genres',
      content: <LinksGroup items={film.genres} basePath="genreIds" />,
      icon: <BookIcon />,
    },
    {
      id: 'releaseDate',
      title: 'Release Date',
      icon: <CalendarIcon />,
      content: <ReleaseDate value={film.releaseDate} />,
    },
    {
      id: 'duration',
      title: 'Runtime',
      icon: <ClockIcon />,
      content: (
        <DataLink basePath="/" query={{ duration: film.duration }}>
          {film.duration} min
        </DataLink>
      ),
    },
    {
      id: 'countries',
      title: 'Origin countries',
      icon: <GlobeIcon />,
      content: <LinksGroup basePath="countryIds" items={film.countries} />,
    },
    {
      id: 'studios',
      title: 'Production studios',
      icon: <BuildingIcon />,
      content: <LinksGroup basePath="studioIds" items={film.studios} />,
    },
    {
      id: 'budget',
      title: 'Budget',
      icon: <WalletIcon />,
      content: (
        <DataLink basePath="/" query={{ budget: film.budget }}>
          {getFormattedMoneyValue(film.budget)}
        </DataLink>
      ),
      isHidden: isSeries(film),
    },
    {
      id: 'boxOffice',
      title: 'Box Office',
      icon: <HandCoinsIcon />,
      content: (
        <DataLink basePath="/" query={{ budget: film.boxOffice }}>
          {getFormattedMoneyValue(film.boxOffice)}
        </DataLink>
      ),
      isHidden: isSeries(film),
    },
    {
      id: 'seriesStats',
      title: 'Series Summary',
      icon: <TvIcon />,
      content: (
        <LinksGroupWrapper>
          <DataLink
            basePath="/"
            query={{
              seasonsTotal: film.seriesExtension?.seasonsTotal ?? 1,
            }}
          >
            {film.seriesExtension?.seasonsTotal}{' '}
            {getPluralWord('season', film.seriesExtension?.seasonsTotal)}
          </DataLink>
          <DataLink
            basePath="/"
            query={{
              episodesTotal: film.seriesExtension?.episodesTotal ?? 0,
            }}
          >
            {film.seriesExtension?.episodesTotal} episodes
          </DataLink>
        </LinksGroupWrapper>
      ),
      isHidden: !isSeries(film),
    },
  ];

  return values.filter((item) => !item.isHidden);
};

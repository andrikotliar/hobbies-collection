import { Link } from '@tanstack/react-router';
import { PlayIcon } from 'lucide-react';
import { useState } from 'react';
import { TrailerWindow } from '~/routes/_home/-components/trailer-window';
import type { ApiResponse } from '~/shared/types/extract-params';
import type { api } from '~/shared/services/api';
import { getYearFromDate } from '~/shared/helpers/get-year-from-date';
import { getPluralWord } from '~/shared/helpers/get-plural-word';
import { AppImage } from '~/shared/components/ui/app-image';
import { getExternalImageUrl } from '~/shared/helpers/get-external-image-url';
import clsx from 'clsx';

type Film = ApiResponse<typeof api.films.getList>['list'][number];

type Props = {
  films: ApiResponse<typeof api.films.getList>['list'];
  shouldShowCounter: boolean;
};

const getYearValue = (film: Film) => {
  if (film.releasedYears) {
    return `Anniversary: ${film.releasedYears} years (${getYearFromDate(film.releaseDate)})`;
  }

  if (film.inDays) {
    return `In ${film.inDays} ${getPluralWord('day', film.inDays)}`;
  }

  return getYearFromDate(film.releaseDate);
};

export const FilmsGrid = ({ films, shouldShowCounter }: Props) => {
  const [selectedFilmId, setSelectedFilmId] = useState<number | null>(null);

  if (!films.length) {
    return (
      <div className="text-slate-600 text-lg font-bold w-full flex items-center justify-center uppercase rounded-lg bg-slate-100 grow">
        Films not found
      </div>
    );
  }

  return (
    <div className="responsive-grid">
      {films.map((film) => (
        <Link
          to="/"
          className="relative block w-full group"
          key={film.id}
          disabled={film.upcoming}
          search={(prev) => ({
            ...prev,
            filmId: film.id,
          })}
        >
          <div className="relative w-full aspect-10/16 rounded-lg overflow-hidden bg-slate-100">
            {shouldShowCounter && (
              <div className="text-sm absolute top-1 right-1 flex items-center justify-center bg-white size-8 rounded-full shadow-sm">
                {film.sequenceNumber}
              </div>
            )}
            {film.upcoming && (
              <div className="text-white text-xs absolute top-0 left-0 bg-red-400 w-full z-8 uppercase p-1 text-center">
                Upcoming
              </div>
            )}
            <AppImage
              className="w-full h-full cover"
              src={getExternalImageUrl(film.imagePath)}
              alt={film.title}
            />
            {film.upcoming && (
              <button
                className="text-white absolute left-0 bottom-0 w-full h-full p-2.5 flex items-end justify-start"
                onClick={() => setSelectedFilmId(film.id)}
              >
                <PlayIcon className="fill-white" />
              </button>
            )}
          </div>
          <h3
            className={clsx(
              'text-center font-normal text-sm leading-4 transition-colors my-1',
              !film.upcoming && 'group-hover:text-sky-600',
            )}
          >
            {film.title}
          </h3>
          <p className="text-center text-xs text-slate-600">{getYearValue(film)}</p>
        </Link>
      ))}
      <TrailerWindow filmId={selectedFilmId} onClose={() => setSelectedFilmId(null)} />
    </div>
  );
};

import { useMemo } from 'react';
import clsx from 'clsx';
import type { ApiResponse } from '~/shared/types/extract-params';
import type { api } from '~/shared/services/api';
import { getExternalImageUrl } from '~/shared/helpers/get-external-image-url';
import { getFilmSummaryConfig } from '~/shared/configs/get-film-summary-config';
import { Rating } from '../../ui/rating';
import { FilmDrawerTitle } from './film-drawer-title';
import { Poster } from './film-drawer-poster';
import { TrailersButton } from './film-drawer-trailers-button';
import { FilmDrawerSummaryBlock } from './film-drawer-summary-block';
import { Collections } from './film-drawer-collections';

type Props = {
  film: ApiResponse<typeof api.films.getById>;
};

export const FilmDrawerSummarySection = ({ film }: Props) => {
  const filmConfig = useMemo(() => {
    return getFilmSummaryConfig(film);
  }, [film]);

  const poster = getExternalImageUrl(film.imagePath);

  return (
    <div className="relative py-7.5 px-4 sm:p-7.5 bg-black/50 overflow-hidden z-2">
      <div
        className={`bg-[url(${poster})] absolute top-0 left-0 w-full h-full -z-1 scale-150 bg-cover bg-center bg-no-repeat bg-gray-700`}
      />

      <div className="flex flex-col gap-2.5">
        <Rating value={film.rating} />
        <FilmDrawerTitle>{film.title}</FilmDrawerTitle>
      </div>

      <div
        className={clsx('flex gap-5 mt-5', !poster ? 'flex-col-reverse' : 'flex-col lg:flex-row')}
      >
        {(poster || film.trailers.length > 0) && (
          <div
            className={clsx(
              'flex flex-col justify-between gap-4',
              poster ? 'items-center' : 'items-start',
            )}
          >
            {poster && <Poster image={poster} title={film.title} />}
            {film.trailers.length > 0 && <TrailersButton data={film.trailers} type={film.type} />}
          </div>
        )}

        <div className="flex flex-col justify-between gap-4 grow">
          {filmConfig.map((item) => (
            <FilmDrawerSummaryBlock label={item.title} key={item.id} icon={item.icon}>
              {item.content}
            </FilmDrawerSummaryBlock>
          ))}
          {(film.collections.length > 0 || film.chaptersRefId) && (
            <Collections list={film.collections} chaptersRefId={film.chaptersRefId} />
          )}
        </div>
      </div>
    </div>
  );
};

import { Link, useLocation } from '@tanstack/react-router';
import { Image } from '~/shared/components/image';
import { getExternalImageUrl } from '~/shared/helpers/get-external-image-url';
import { getYearFromDate } from '~/shared/helpers/get-year-from-date';
import type { api } from '~/shared/services/api';
import type { ApiResponse } from '~/shared/types/extract-params';

type Props = {
  film: ApiResponse<typeof api.films.search>[number];
  onFilmOpen: VoidFunction;
};

export const FoundFilm = ({ film, onFilmOpen }: Props) => {
  const genres = film.genres.map((genre) => genre.title).join(', ');
  const location = useLocation();

  return (
    <Link
      to={location.pathname}
      className="flex gap-2.5 border border-transparent overflow-hidden group"
      onClick={onFilmOpen}
      search={{ filmId: film.id }}
    >
      <div className="flex w-12 rounded-sm overflow-hidden shrink-0">
        <Image src={getExternalImageUrl(film.imagePath)} alt={`Poster of the "${film.title}"`} />
      </div>
      <div className="flex flex-col w-full min-w-0">
        <h3 className="text-lg font-bold overflow-hidden text-ellipsis whitespace-nowrap group-hover:text-sky-600">
          {film.title}
        </h3>
        <p className="text-slate-600 text-sm">{genres}</p>
        <div className="text-xs mt-auto">{getYearFromDate(film.releaseDate)}</div>
      </div>
    </Link>
  );
};

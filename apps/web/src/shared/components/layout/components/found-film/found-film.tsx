import styles from './styles.module.css';
import { Link, useLocation } from '@tanstack/react-router';
import { Image } from '~/shared/components/image/image';
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
      className={styles.film_link}
      onClick={onFilmOpen}
      search={{ filmId: film.id }}
    >
      <div className={styles.poster_wrapper}>
        <Image src={getExternalImageUrl(film.imagePath)} alt={`Poster of the "${film.title}"`} />
      </div>
      <div className={styles.info_wrapper}>
        <h3 className={styles.film_title}>{film.title}</h3>
        <p className={styles.genres_list}>{genres}</p>
        <div className={styles.release_date}>{getYearFromDate(film.releaseDate)}</div>
      </div>
    </Link>
  );
};

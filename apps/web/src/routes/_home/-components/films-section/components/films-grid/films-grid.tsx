import {
  getExternalImageUrl,
  getPluralWord,
  getYearFromDate,
  Image,
  type api,
  type ApiResponse,
} from '~/shared';
import styles from './films-grid.module.css';
import { Link } from '@tanstack/react-router';
import { FilmsNotFound } from '~/routes/_home/-components/films-section/components/films-not-found/films-not-found';
import { PlayIcon } from 'lucide-react';
import { useState } from 'react';
import { TrailerWindow } from '~/routes/_home/-components/films-section/components/trailer-window/trailer-window';

type Film = ApiResponse<typeof api.films.getList>['list'][number];

type FilmsGridProps = {
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

export const FilmsGrid = ({ films, shouldShowCounter }: FilmsGridProps) => {
  const [selectedFilmId, setSelectedFilmId] = useState<number | null>(null);

  if (!films.length) {
    return <FilmsNotFound />;
  }

  return (
    <div className={styles.grid}>
      {films.map((film) => (
        <Link
          to="/"
          className={styles.film_link}
          key={film.id}
          disabled={film.upcoming}
          search={(prev) => ({
            ...prev,
            filmId: film.id,
          })}
        >
          <div className={styles.cover}>
            {shouldShowCounter && <div className={styles.counter}>{film.sequenceNumber}</div>}
            {film.upcoming && <div className={styles.upcoming}>Upcoming</div>}
            <Image src={getExternalImageUrl(film.imagePath)} alt={film.title} />
            {film.upcoming && (
              <button className={styles.play_button} onClick={() => setSelectedFilmId(film.id)}>
                <PlayIcon />
              </button>
            )}
          </div>
          <h3 className={styles.title}>{film.title}</h3>
          <p className={styles.year}>{getYearValue(film)}</p>
        </Link>
      ))}
      <TrailerWindow filmId={selectedFilmId} onClose={() => setSelectedFilmId(null)} />
    </div>
  );
};

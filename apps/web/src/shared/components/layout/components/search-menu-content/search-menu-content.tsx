import styles from './styles.module.css';
import { FoundFilm } from '../found-film/found-film';
import type { ApiResponse } from '~/shared/types/extract-params';
import type { api } from '~/shared/services/api';

type Props = {
  films: ApiResponse<typeof api.films.search>;
  onFilmOpen: VoidFunction;
};

export const SearchMenuContent = ({ films, onFilmOpen }: Props) => {
  const isEmpty = films.length === 0;

  if (isEmpty) {
    return (
      <div className={styles.search_menu_content}>
        <div>Not found</div>
      </div>
    );
  }

  return (
    <div className={styles.search_menu_content}>
      <div className={styles.films_list}>
        {films.map((film) => (
          <FoundFilm key={film.id} film={film} onFilmOpen={onFilmOpen} />
        ))}
      </div>
    </div>
  );
};

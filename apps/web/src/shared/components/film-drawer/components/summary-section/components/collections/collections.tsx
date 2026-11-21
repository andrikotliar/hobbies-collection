import styles from './styles.module.css';
import { Link } from '@tanstack/react-router';
import { FilmIcon } from 'lucide-react';
import clsx from 'clsx';
import type { ApiResponse } from '~/shared/types/extract-params';
import type { api } from '~/shared/services/api';
import { getColorBaseOnFirstLetter } from '../../helpers/get-color-based-on-first-letter';

type Props = {
  list: ApiResponse<typeof api.films.getById>['collections'];
  chaptersRefId: number | null;
};

export const Collections = ({ list, chaptersRefId }: Props) => {
  return (
    <div className={styles.collections}>
      {chaptersRefId && (
        <Link
          to="/"
          search={{ originFilmId: chaptersRefId, orderKey: 'sequenceNumber' }}
          className={clsx(styles.collection_link, styles.chapter_link)}
        >
          <FilmIcon />
          <span>Chapters</span>
        </Link>
      )}
      {list.map((collection) => (
        <Link
          to="/"
          search={{ collectionId: collection.id }}
          className={styles.collection_link}
          style={{ backgroundColor: getColorBaseOnFirstLetter(collection.title) }}
          key={collection.id}
        >
          <span className={styles.hash}>#</span>
          <span>{collection.title}</span>
        </Link>
      ))}
    </div>
  );
};

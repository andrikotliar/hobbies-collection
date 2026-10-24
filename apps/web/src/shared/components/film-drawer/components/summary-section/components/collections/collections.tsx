import type { api, ApiResponse } from '~/shared';
import styles from './collections.module.css';
import { Link } from '@tanstack/react-router';
import { getColorBaseOnFirstLetter } from '../../helpers';
import { FilmIcon } from 'lucide-react';
import clsx from 'clsx';

type CollectionsProps = {
  list: ApiResponse<typeof api.films.getById>['collections'];
  chaptersRefId: number | null;
};

export const Collections = ({ list, chaptersRefId }: CollectionsProps) => {
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

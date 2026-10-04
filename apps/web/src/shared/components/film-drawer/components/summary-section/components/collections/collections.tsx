import type { api, ApiResponse } from '~/shared';
import styles from './collections.module.css';
import { Link } from '@tanstack/react-router';
import { getColorBaseOnFirstLetter } from '../../helpers';
import { CollectionCategory, type Enum } from '@hobbies-collection/shared';
import { FilmIcon } from 'lucide-react';
import clsx from 'clsx';

type CollectionsProps = {
  list: ApiResponse<typeof api.films.getById>['collections'];
};

type CollectionGroups = {
  collections: CollectionsProps['list'];
  chapters: CollectionsProps['list'][number] | null;
};

const chapterCategories: Enum<typeof CollectionCategory>[] = [
  CollectionCategory.CHAPTER,
  CollectionCategory.CINEMATIC_UNIVERSE,
];

export const Collections = ({ list }: CollectionsProps) => {
  const collectionGroups = list.reduce(
    (groups, collection) => {
      if (!groups.chapters && chapterCategories.includes(collection.category)) {
        groups.chapters = collection;
        return groups;
      }

      groups.collections.push(collection);

      return groups;
    },
    {
      collections: [],
      chapters: null,
    } as CollectionGroups,
  );

  return (
    <div className={styles.collections}>
      {collectionGroups.chapters && (
        <Link
          to="/films"
          search={{ collectionId: collectionGroups.chapters.id }}
          className={clsx(styles.collection_link, styles.chapter_link)}
          key={collectionGroups.chapters.id}
        >
          <FilmIcon />
          <span>Chapters</span>
        </Link>
      )}
      {collectionGroups.collections.map((collection) => (
        <Link
          to="/films"
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

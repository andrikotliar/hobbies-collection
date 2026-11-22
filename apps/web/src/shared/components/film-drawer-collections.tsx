import { Link, type LinkProps } from '@tanstack/react-router';
import { FilmIcon } from 'lucide-react';
import clsx from 'clsx';
import type { ApiResponse } from '~/shared/types/extract-params';
import type { api } from '~/shared/services/api';
import { getColorBaseOnFirstLetter } from '~/shared/helpers/get-color-based-on-first-letter';

type Props = {
  list: ApiResponse<typeof api.films.getById>['collections'];
  chaptersRefId: number | null;
};

const CollectionLink = ({
  className,
  style,
  ...props
}: LinkProps & { className?: string; style?: React.CSSProperties }) => {
  return (
    <Link
      className={clsx(
        'flex items-center gap-0.5 bg-white py-0.5 px-4 rounded-md text-sm uppercase font-stretch-ultra-condensed',
        className,
      )}
      style={style}
      {...props}
    />
  );
};

export const Collections = ({ list, chaptersRefId }: Props) => {
  return (
    <div className="flex flex-wrap gap-4">
      {chaptersRefId && (
        <CollectionLink
          to="/"
          search={{ originFilmId: chaptersRefId, orderKey: 'sequenceNumber' }}
          className="bg-linear-45 from-gray-400 to-white"
        >
          <FilmIcon />
          <span>Chapters</span>
        </CollectionLink>
      )}
      {list.map((collection) => (
        <CollectionLink
          to="/"
          search={{ collectionId: collection.id }}
          style={{ backgroundColor: getColorBaseOnFirstLetter(collection.title) }}
          key={collection.id}
        >
          <span className="text-xl">#</span>
          <span>{collection.title}</span>
        </CollectionLink>
      ))}
    </div>
  );
};

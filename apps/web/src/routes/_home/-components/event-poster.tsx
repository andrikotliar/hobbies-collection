import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import type { QueryParams } from '~/shared/types/extract-params';
import type { api } from '~/shared/services/api';
import { getExternalImageUrl } from '~/shared/helpers/get-external-image-url';
import { AppImage } from '~/shared/components/ui/app-image';

type Props = {
  isSelected?: boolean;
  posterPath: string | null;
  title: string;
  subTitle?: string | null;
  search: QueryParams<typeof api.films.getList>;
};

export const EventPoster = ({ posterPath, isSelected = false, title, subTitle, search }: Props) => {
  return (
    <Link to="/" search={search} className="w-20 relative group">
      <div
        className={clsx(
          'relative size-20 rounded-full overflow-hidden border-2 border-white',
          isSelected ? 'ring-4' : 'ring-2',
        )}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-black/30" />
        <AppImage
          src={getExternalImageUrl(posterPath)}
          className="transition-transform group-hover:scale-110"
        />
      </div>
      <div className="group-hover:text-sky-600 text-sm mt-1 text-center">
        {subTitle} {title}
      </div>
    </Link>
  );
};

import { Link } from '@tanstack/react-router';
import styles from './styles.module.css';
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
    <Link
      to="/"
      search={search}
      className={clsx(styles.event_banner_button, isSelected && styles.selected_event)}
    >
      <div className={styles.event_banner_inner}>
        <AppImage src={getExternalImageUrl(posterPath)} className={styles.poster_image} />
      </div>
      <div className={styles.event_title}>
        {subTitle} {title}
      </div>
    </Link>
  );
};

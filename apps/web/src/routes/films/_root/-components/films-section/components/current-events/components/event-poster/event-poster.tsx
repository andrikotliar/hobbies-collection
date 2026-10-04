import { Link } from '@tanstack/react-router';
import styles from './event-poster.module.css';
import clsx from 'clsx';
import { getExternalImageUrl, Image, type api, type QueryParams } from '~/shared';

type EventPosterProps = {
  isSelected?: boolean;
  posterPath: string | null;
  title: string;
  subTitle?: string | null;
  search: QueryParams<typeof api.films.getList>;
};

export const EventPoster = ({
  posterPath,
  isSelected = false,
  title,
  subTitle,
  search,
}: EventPosterProps) => {
  return (
    <Link
      to="/"
      search={search}
      className={clsx(styles.event_banner_button, isSelected && styles.selected_event)}
    >
      <div className={styles.event_banner_inner}>
        <Image src={getExternalImageUrl(posterPath)} className={styles.poster_image} />
      </div>
      <div className={styles.event_title}>
        {subTitle} {title}
      </div>
    </Link>
  );
};

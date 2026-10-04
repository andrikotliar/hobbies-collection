import styles from './current-events.module.css';
import { type api, type ApiResponse } from '~/shared';
import { Link, useSearch } from '@tanstack/react-router';
import {
  EventBanner,
  EventPoster,
} from '~/routes/_home/-components/films-section/components/current-events/components';

type CurrentEventsProps = {
  data?: ApiResponse<typeof api.films.getList>;
};

export const CurrentEvents = ({ data }: CurrentEventsProps) => {
  const search = useSearch({ from: '/_home/' });

  if (!data || !data.events.length || !data.anniversaryImagePath) {
    return null;
  }

  const shouldShowReset = search.collectionId || search.releasedThisDay;

  return (
    <div className={styles.events_track}>
      {shouldShowReset && (
        <Link className={styles.all_films_link} to="/">
          <div className={styles.all_films_link_inner}>{data.total}</div>
          <div className={styles.all_films_link_title}>All films</div>
        </Link>
      )}
      {data.anniversaryImagePath && (
        <EventPoster
          posterPath={data.anniversaryImagePath}
          title="Anniversaries"
          search={{ releasedThisDay: true }}
          isSelected={search.releasedThisDay}
        />
      )}
      {data.events.map((event) => (
        <EventBanner event={event} key={event.id} selectedEventId={search.collectionId} />
      ))}
    </div>
  );
};

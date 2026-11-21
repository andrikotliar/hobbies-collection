import type { ApiResponse } from '~/shared/types/extract-params';
import styles from './styles.module.css';
import { Link, useSearch } from '@tanstack/react-router';
import type { api } from '~/shared/services/api';
import { EventPoster } from './components/event-poster/event-poster';
import { EventBanner } from './components/event-banner/event-banner';

type Props = {
  events: ApiResponse<typeof api.films.getList>['events'];
  total: number;
  anniversaryPoster: string | null;
};

export const CurrentEvents = ({ events, total, anniversaryPoster }: Props) => {
  const search = useSearch({ from: '/_home/' });

  if (!events.length && !anniversaryPoster) {
    return null;
  }

  const shouldShowReset = search.collectionId || search.releasedThisDay;

  return (
    <div className={styles.events_track}>
      {shouldShowReset && (
        <Link className={styles.all_films_link} to="/">
          <div className={styles.all_films_link_inner}>{total}</div>
          <div className={styles.all_films_link_title}>All films</div>
        </Link>
      )}
      {anniversaryPoster && (
        <EventPoster
          posterPath={anniversaryPoster}
          title="Anniversaries"
          search={{ releasedThisDay: true }}
          isSelected={search.releasedThisDay}
        />
      )}
      {events.map((event) => (
        <EventBanner event={event} key={event.id} selectedEventId={search.collectionId} />
      ))}
    </div>
  );
};

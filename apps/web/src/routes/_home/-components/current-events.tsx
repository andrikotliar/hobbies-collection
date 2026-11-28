import type { ApiResponse } from '~/shared/types/extract-params';
import { Link, useSearch } from '@tanstack/react-router';
import type { api } from '~/shared/services/api';
import { EventPoster } from './event-poster';
import { EventBanner } from './event-banner';

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
    <div className="flex items-start gap-5 p-1 overflow-x-auto">
      {shouldShowReset && (
        <Link className="relative w-20 mr-5" to="/">
          <div className="absolute top-0 -right-5 w-0.5 h-20 bg-slate-100" />
          <div className="flex items-center justify-center text-white size-20 bg-linear-45 from-sky-900 to-sky-600 rounded-full border-2 border-white ring-2 ring-sky-600">
            {total}
          </div>
          <div className="text-sm text-center mt-1">All films</div>
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

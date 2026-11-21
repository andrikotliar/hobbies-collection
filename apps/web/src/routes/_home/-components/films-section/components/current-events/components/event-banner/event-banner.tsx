import { getPluralWord } from '~/shared/helpers/get-plural-word';
import type { api } from '~/shared/services/api';
import type { ApiResponse } from '~/shared/types/extract-params';
import { EventPoster } from '../event-poster/event-poster';

type Props = {
  event: ApiResponse<typeof api.films.getList>['events'][number];
  selectedEventId?: number;
};

export const EventBanner = ({ event, selectedEventId }: Props) => {
  const year = new Date().getFullYear();
  const isSelected = selectedEventId === event.collectionId;
  const subTitle = event.yearFrom
    ? `${year - event.yearFrom} ${getPluralWord('year', event.yearFrom)} since`
    : null;

  return (
    <EventPoster
      isSelected={isSelected}
      posterPath={event.imagePath}
      title={event.title}
      subTitle={subTitle}
      search={{ collectionId: event.collectionId }}
    />
  );
};

import { EventPoster } from '~/routes/films/_root/-components/films-section/components/current-events/components/event-poster/event-poster';
import { getPluralWord, type api, type ApiResponse } from '~/shared';

type EventBannerProps = {
  event: ApiResponse<typeof api.films.getList>['events'][number];
  selectedEventId?: number;
};

export const EventBanner = ({ event, selectedEventId }: EventBannerProps) => {
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

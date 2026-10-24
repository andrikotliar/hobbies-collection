import { Drawer } from '~/shared/components/drawer/drawer';
import {
  Awards,
  CastAndCrew,
  ContentLayout,
  FilmPageLayout,
  PageSkeleton,
  SummarySection,
} from '~/shared/components/film-drawer/components';
import type { FilmResponse } from '@hobbies-collection/shared';

type FilmDrawerProps = {
  data?: FilmResponse;
  isLoading?: boolean;
  onCloseNavigation: VoidFunction;
};

export const FilmDrawer = ({ data, isLoading = false, onCloseNavigation }: FilmDrawerProps) => {
  const hasExtendedData = data?.awards.length !== 0 || data.castAndCrew.length !== 0;

  return (
    <Drawer isOpen onClose={onCloseNavigation} maxWidth={940}>
      {isLoading && <PageSkeleton />}

      {data && (
        <FilmPageLayout>
          <SummarySection film={data} hasExtendedData={hasExtendedData} />
          <ContentLayout>
            {data.castAndCrew.length !== 0 && <CastAndCrew data={data.castAndCrew} />}
            {data.awards.length > 0 && <Awards data={data.awards} />}
          </ContentLayout>
        </FilmPageLayout>
      )}
    </Drawer>
  );
};

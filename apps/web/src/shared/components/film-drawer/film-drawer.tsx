import { useQuery } from '@tanstack/react-query';
import { Drawer } from '~/shared/components/drawer/drawer';
import { useLocation, useNavigate } from '@tanstack/react-router';
import {
  getAdminFilmQueryOptions,
  getFilmQueryOptions,
} from '~/shared/helpers/query-options/films/get-film-query-options';
import { PageSkeleton } from './components/page-skeleton/page-skeleton';
import { FilmPageLayout } from './components/film-page-layout/film-page-layout';
import { SummarySection } from './components/summary-section/summary-section';
import { ContentLayout } from './components/content-layout/content-layout';
import { CastAndCrew } from './components/cast-and-crew/cast-and-crew';
import { Awards } from './components/awards/awards';
import { VisibleSection } from '~/shared/components/film-drawer/components/visible-section';

type Props = {
  filmId: number;
};

const getQueryOptions = (isConsole: boolean, filmId: number) => {
  if (isConsole) {
    return getAdminFilmQueryOptions(filmId);
  }

  return getFilmQueryOptions(filmId);
};

export const FilmDrawer = ({ filmId }: Props) => {
  const location = useLocation();
  const { data: film, isLoading } = useQuery(
    getQueryOptions(location.pathname.startsWith('/console'), filmId),
  );
  const navigate = useNavigate();

  const hasExtendedData = film?.awards.length !== 0 || film.castAndCrew.length !== 0;

  const closeDrawer = () => {
    navigate({
      to: location.pathname,
      search: ({ filmId: _filmId, ...prev }) => prev,
    });
  };

  return (
    <Drawer isOpen onClose={closeDrawer} maxWidth={940}>
      {isLoading && <PageSkeleton />}

      {film && (
        <FilmPageLayout>
          <SummarySection film={film} hasExtendedData={hasExtendedData} />
          <ContentLayout>
            <VisibleSection data={film.castAndCrew} component={CastAndCrew} />
            <VisibleSection data={film.awards} component={Awards} />
          </ContentLayout>
        </FilmPageLayout>
      )}
    </Drawer>
  );
};

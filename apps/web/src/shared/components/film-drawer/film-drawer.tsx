import { useQuery } from '@tanstack/react-query';
import { Drawer } from '~/shared/components/drawer/drawer';
import {
  Awards,
  CastAndCrew,
  ContentLayout,
  FilmPageLayout,
  PageSkeleton,
  SummarySection,
} from '~/shared/components/film-drawer/components';
import { getAdminFilmQueryOptions, getFilmQueryOptions } from '~/shared/helpers';
import { useLocation, useNavigate } from '@tanstack/react-router';

type FilmDrawerProps = {
  filmId: number;
};

const getQueryOptions = (isConsole: boolean, filmId: number) => {
  if (isConsole) {
    return getAdminFilmQueryOptions(filmId);
  }

  return getFilmQueryOptions(filmId);
};

export const FilmDrawer = ({ filmId }: FilmDrawerProps) => {
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
    <Drawer isOpen onClose={closeDrawer}>
      {isLoading && <PageSkeleton />}

      {film && (
        <FilmPageLayout>
          <SummarySection film={film} hasExtendedData={hasExtendedData} />
          <ContentLayout>
            {film.castAndCrew.length !== 0 && <CastAndCrew data={film.castAndCrew} />}
            {film.awards.length > 0 && <Awards data={film.awards} />}
          </ContentLayout>
        </FilmPageLayout>
      )}
    </Drawer>
  );
};

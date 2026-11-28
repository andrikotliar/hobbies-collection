import { useQuery } from '@tanstack/react-query';
import { Drawer } from '~/shared/components/ui/drawer';
import { useLocation, useNavigate } from '@tanstack/react-router';
import {
  getAdminFilmQueryOptions,
  getFilmQueryOptions,
} from '~/shared/helpers/query-options/films/get-film-query-options';
import { FilmDrawerSummarySection } from './film-drawer-summary-section';
import { FilmDrawerCastAndCrew } from './film-drawer-cast-and-crew';
import { FilmDrawerAwards } from './film-drawer-awards';
import { FilmDrawerPageSkeleton } from '~/shared/components/drawers/film/film-drawer-page-skeleton';
import { VisibleSection } from '~/shared/components/layout/visible-section';

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

  const closeDrawer = () => {
    navigate({
      to: location.pathname,
      search: ({ filmId: _filmId, ...prev }) => prev,
    });
  };

  return (
    <Drawer isOpen onClose={closeDrawer} maxWidth={940}>
      {isLoading && <FilmDrawerPageSkeleton />}

      {film && (
        <div className="flex flex-col text-black">
          <FilmDrawerSummarySection film={film} />
          <div className="bg-white overflow-hidden relative">
            <VisibleSection data={film.castAndCrew} component={FilmDrawerCastAndCrew} />
            <VisibleSection data={film.awards} component={FilmDrawerAwards} />
          </div>
        </div>
      )}
    </Drawer>
  );
};

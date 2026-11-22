import { useQuery } from '@tanstack/react-query';
import { Drawer } from '~/shared/components/drawer';
import { useLocation, useNavigate } from '@tanstack/react-router';
import {
  getAdminFilmQueryOptions,
  getFilmQueryOptions,
} from '~/shared/helpers/query-options/films/get-film-query-options';
import { PageSkeleton } from './page-skeleton';
import { SummarySection } from './summary-section';
import { CastAndCrew } from './film-drawer-cast-and-crew';
import { Awards } from './film-drawer-awards';
import { VisibleSection } from '~/shared/components/visible-section';

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
      {isLoading && <PageSkeleton />}

      {film && (
        <div className="flex flex-col text-black">
          <SummarySection film={film} />
          <div className="bg-white overflow-hidden relative">
            <VisibleSection data={film.castAndCrew} component={CastAndCrew} />
            <VisibleSection data={film.awards} component={Awards} />
          </div>
        </div>
      )}
    </Drawer>
  );
};

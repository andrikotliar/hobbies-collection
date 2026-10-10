import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { buildGetAdminFilmQueryOptions } from '~/shared';
import { FilmDrawer } from '~/shared/components/film-drawer/film-drawer';

export const Route = createFileRoute('/console/films/view/$id')({
  component: RouteComponent,
  staticData: {
    title: 'Films',
    backPath: '/console',
  },
});

function RouteComponent() {
  const params = Route.useParams();
  const navigate = Route.useNavigate();
  const { data, isLoading } = useQuery(buildGetAdminFilmQueryOptions(Number(params.id)));

  const closeDrawer = () => {
    navigate({
      to: '/console/films',
      search: (search) => search,
    });
  };

  return <FilmDrawer data={data} isLoading={isLoading} onCloseNavigation={closeDrawer} />;
}

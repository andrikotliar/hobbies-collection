import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { buildGetFilmQueryOptions } from '~/shared';
import { FilmDrawer } from '~/shared/components/film-drawer/film-drawer';

export const Route = createFileRoute('/films/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const navigate = Route.useNavigate();
  const { data, isLoading } = useQuery(buildGetFilmQueryOptions(Number(params.id)));

  const closeDrawer = () => {
    navigate({
      to: '/films',
      search: (prev) => prev,
    });
  };

  return <FilmDrawer data={data} isLoading={isLoading} onCloseNavigation={closeDrawer} />;
}

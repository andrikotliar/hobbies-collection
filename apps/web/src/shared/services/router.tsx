import { HttpError } from '@hobbies-collection/contracts';
import { createRouter } from '@tanstack/react-router';
import { routeTree } from '~/routeTree.gen';
import { ErrorScreen, PageLoader } from '~/shared/components';
import { queryClient } from '~/shared/services/query-client';

export const router = createRouter({
  routeTree,
  defaultNotFoundComponent: () => {
    const error = new HttpError(404, 'Not found', {});
    return <ErrorScreen error={error} />;
  },
  defaultErrorComponent: ({ error }) => {
    return <ErrorScreen error={error} />;
  },
  defaultPendingComponent: PageLoader,
  defaultPendingMs: 0,
  defaultPendingMinMs: 0,
  context: { queryClient },
});

const routesToPreload = [
  router.routesByPath['/films/$id'],
  router.routesByPath['/console/films/view/$id'],
];

void Promise.all(routesToPreload.map((route) => router.loadRouteChunk(route)));

import { HttpError } from '@hobbies-collection/contracts';
import { createRouter } from '@tanstack/react-router';
import { routeTree } from '~/routeTree.gen';
import { ErrorScreen } from '~/shared/components/error-screen';
import { PageLoader } from '~/shared/components/page-loader/page-loader';
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

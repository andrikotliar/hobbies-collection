import { HttpError } from '@hobbies-collection/contracts';
import { createRouter } from '@tanstack/react-router';
import { routeTree } from '~/routeTree.gen';
import { ErrorScreen } from '~/shared/components/layout/error-screen';
import { Loader } from '~/shared/components/ui/loader';
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
  defaultPendingComponent: () => <Loader isFullPage />,
  defaultPendingMs: 0,
  defaultPendingMinMs: 0,
  context: { queryClient },
});

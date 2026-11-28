import { createFileRoute } from '@tanstack/react-router';
import { Sessions } from '~/routes/console/sessions/-components/sessions';
import { getUserSessionsQueryOptions } from '~/shared/helpers/query-options/users/get-user-sessions';

export const Route = createFileRoute('/console/sessions')({
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(getUserSessionsQueryOptions());
  },
  component: RouteComponent,
  staticData: {
    title: 'Sessions',
    backPath: '/console',
  },
  head: () => ({
    meta: [
      {
        title: 'Sessions - Films Collection',
      },
    ],
  }),
});

function RouteComponent() {
  return <Sessions />;
}

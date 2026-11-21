import { createFileRoute } from '@tanstack/react-router';
import { ConsoleRootMenu } from '~/shared/components/console-root-menu/console-root-menu';
import { getAuthStateQueryOptions } from '~/shared/helpers/query-options/auth/get-auth-state-query-options';

export const Route = createFileRoute('/console/')({
  loader: async ({ context: { queryClient } }) => {
    await queryClient.fetchQuery(getAuthStateQueryOptions());
  },
  component: RouteComponent,
  staticData: {
    title: 'Console',
  },
  head: () => ({
    meta: [
      {
        title: 'Console - Films Collection',
      },
    ],
  }),
});

function RouteComponent() {
  return <ConsoleRootMenu />;
}

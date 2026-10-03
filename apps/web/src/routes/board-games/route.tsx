import { createFileRoute } from '@tanstack/react-router';
import { buildGetBoardGamesListQueryOptions, PageTitle } from '~/shared';

export const Route = createFileRoute('/board-games')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(buildGetBoardGamesListQueryOptions());
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <PageTitle>Board Games</PageTitle>
    </div>
  );
}

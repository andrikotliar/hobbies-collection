import { createFileRoute } from '@tanstack/react-router';
import { buildGetBooksListQueryOptions, PageTitle } from '~/shared';

export const Route = createFileRoute('/books')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(buildGetBooksListQueryOptions());
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <PageTitle>Books</PageTitle>
    </div>
  );
}

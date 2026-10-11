import { createFileRoute } from '@tanstack/react-router';
import { buildGetBooksListQueryOptions, PageTitle } from '~/shared';

export const Route = createFileRoute('/books')({
  loader: async ({ context, location }) => {
    await context.queryClient.ensureQueryData(buildGetBooksListQueryOptions(location.search));
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

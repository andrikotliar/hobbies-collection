import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { HobbyContainer } from '~/shared/components/hobbies/hobby-container/hobby-container';
import { HobbyItemsGrid } from '~/shared/components/hobbies/hobby-items-grid/hobby-items-grid';
import { HobbyTitle } from '~/shared/components/hobbies/hobby-title/hobby-title';
import { getHobbyByTitleQueryOptions } from '~/shared/helpers/query-options/hobbies/get-hobby-by-title-query-options';

export const Route = createFileRoute('/books')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(getHobbyByTitleQueryOptions('Books'));
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useSuspenseQuery(getHobbyByTitleQueryOptions('Books'));

  return (
    <HobbyContainer>
      <HobbyTitle imagePath={data.imagePath} total={data.items.length}>
        {data.title} Collection
      </HobbyTitle>
      <HobbyItemsGrid items={data.items} />
    </HobbyContainer>
  );
}

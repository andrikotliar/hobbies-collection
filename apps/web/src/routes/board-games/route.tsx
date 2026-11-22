import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { HobbyItemsGrid } from '~/shared/components/hobby-items-grid';
import { HobbyTitle } from '~/shared/components/hobby-title';
import { getHobbyByTitleQueryOptions } from '~/shared/helpers/query-options/hobbies/get-hobby-by-title-query-options';

export const Route = createFileRoute('/board-games')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(getHobbyByTitleQueryOptions('Board Games'));
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useSuspenseQuery(getHobbyByTitleQueryOptions('Board Games'));

  return (
    <div className="w-full">
      <HobbyTitle imagePath={data.imagePath} total={data.items.length}>
        {data.title} Collection
      </HobbyTitle>
      <HobbyItemsGrid items={data.items} />
    </div>
  );
}

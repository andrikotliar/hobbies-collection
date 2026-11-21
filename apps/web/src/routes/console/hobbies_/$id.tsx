import { mutationOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { HobbyItemForm } from '~/routes/console/hobbies_/-components/hobby-item-form';
import { getDefaultHobbyItem } from '~/routes/console/hobbies_/-configs/default-form-values';
import { ConsolePageList } from '~/shared/components/console-page-list/console-page-list';
import { useFormModal } from '~/shared/context/form-modal-context';
import { getHobbyAdminQueryOptions } from '~/shared/helpers/query-options/hobbies/get-hobby-admin-query-options';
import { withFormModal } from '~/shared/helpers/with-form-modal';
import { api } from '~/shared/services/api';

const getDeleteHobbyItemMutations = (hobbyId: number) => {
  return () => {
    return mutationOptions({
      mutationFn: (itemId: number) =>
        api.hobbies.deleteHobbyItem({ params: { id: hobbyId, itemId } }),
    });
  };
};

export const Route = createFileRoute('/console/hobbies_/$id')({
  loader: async ({ context, params }) => {
    return context.queryClient.ensureQueryData(getHobbyAdminQueryOptions(+params.id));
  },
  component: withFormModal(HobbyItemForm, RouteComponent),
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.title} - Hobbies`,
      },
    ],
  }),
  staticData: {
    title: 'Hobby',
    backPath: '/console/hobbies',
  },
});

function RouteComponent() {
  const params = Route.useParams();
  const { data, isLoading } = useSuspenseQuery(getHobbyAdminQueryOptions(+params.id));

  const { onOpen } = useFormModal();

  return (
    <ConsolePageList
      data={{ list: data.items }}
      getDeleteMutationOptions={getDeleteHobbyItemMutations(Number(params.id))}
      isFetching={isLoading}
      onEdit={onOpen}
      onCreate={() => onOpen(getDefaultHobbyItem())}
      createItemTitle="Create hobby item"
    />
  );
}

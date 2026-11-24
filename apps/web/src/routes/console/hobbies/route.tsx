import { NEW_ITEM_ID } from '@hobbies-collection/shared';
import { mutationOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { HobbyForm } from '~/routes/console/hobbies/-components/hobby-form';
import { ConsolePageList } from '~/shared/components/layout/console-page-list';
import { useFormModal } from '~/shared/context/form-modal-context';
import { getHobbiesListQueryOptions } from '~/shared/helpers/query-options/hobbies/get-hobbies-list-query-options';
import { withFormModal } from '~/shared/helpers/with-form-modal';
import { api, queryKey } from '~/shared/services/api';

const getDeleteMutationOptions = () => {
  return mutationOptions({
    mutationFn: (id: number) => api.hobbies.deleteHobby({ params: { id } }),
    meta: {
      invalidateQueries: [{ queryKey: queryKey('hobbies.getHobbiesList') }],
    },
  });
};

export const Route = createFileRoute('/console/hobbies')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(getHobbiesListQueryOptions());
  },
  component: withFormModal(HobbyForm, RouteComponent),
  staticData: {
    title: 'Hobbies',
    backPath: '/console',
  },
  head: () => ({
    meta: [
      {
        title: 'Hobbies - Films Collection',
      },
    ],
  }),
});

function RouteComponent() {
  const { onOpen } = useFormModal();
  const { data } = useSuspenseQuery(getHobbiesListQueryOptions());

  const navigate = useNavigate();

  return (
    <ConsolePageList
      data={{ list: data.list, total: 0 }}
      getDeleteMutationOptions={getDeleteMutationOptions}
      isFetching={false}
      onEdit={onOpen}
      onCreate={() => onOpen({ title: '', id: NEW_ITEM_ID })}
      onView={(item) =>
        navigate({ to: '/console/hobbies/$id', params: { id: item.id.toString() } })
      }
    />
  );
}

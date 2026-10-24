import { mutationOptions, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import {
  api,
  getEmptyFormValues,
  getStudiosListQueryOptions,
  queryKey,
  type Input,
} from '~/shared';
import { List, useFormModal, withFormModal } from '~/routes/console/-shared';
import { StudioForm } from '~/routes/console/studios/-components';
import { useCallback } from 'react';
import { CommonListQuerySchema } from '@hobbies-collection/shared';

const studioInitialValues = getEmptyFormValues<Input<typeof api.studios.create>>({
  title: '',
});

export const Route = createFileRoute('/console/studios')({
  validateSearch: (search) => CommonListQuerySchema.parse(search),
  loader: async ({ context: { queryClient }, location }) => {
    await queryClient.ensureQueryData(getStudiosListQueryOptions(location.search));
  },
  component: withFormModal(StudioForm, PageContainer),
  staticData: {
    title: 'Studios',
    backPath: '/console',
  },
  head: () => ({
    meta: [
      {
        title: 'Studios - Films Collection',
      },
    ],
  }),
});

const getDeleteMutationOptions = () => {
  return mutationOptions({
    mutationFn: (id: number) => api.studios.delete({ params: { id } }),
    meta: {
      invalidateQueries: { queryKey: queryKey('studios.getList') },
    },
  });
};

function PageContainer() {
  const search = Route.useSearch();
  const { data, isFetching } = useQuery(getStudiosListQueryOptions(search));
  const { onOpen } = useFormModal();
  const navigate = Route.useNavigate();

  const handlePageChange = (index: number) => {
    navigate({
      search: (prev) => ({
        ...prev,
        pageIndex: index,
      }),
    });
  };

  const handleSearch = useCallback((value: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        q: value,
        pageIndex: 0,
      }),
    });
  }, []);

  return (
    <List
      data={data}
      getDeleteMutationOptions={getDeleteMutationOptions}
      onEdit={onOpen}
      isFetching={isFetching}
      onCreate={() => onOpen(studioInitialValues)}
      createItemTitle="New studio"
      onSearch={handleSearch}
      onPageChange={handlePageChange}
    />
  );
}

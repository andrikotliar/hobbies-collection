import { mutationOptions, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useCallback } from 'react';
import { CommonListQuerySchema } from '@hobbies-collection/shared';
import { api, queryKey } from '~/shared/services/api';
import { ConsolePageList } from '~/shared/components/layout/console-page-list';
import { useFormModal } from '~/shared/context/form-modal-context';
import { getStudiosListQueryOptions } from '~/shared/helpers/query-options/studios/get-studios-list-query-options';
import { withFormModal } from '~/shared/helpers/with-form-modal';
import { StudioForm } from '~/routes/console/studios/-components/studio-form';
import { studioInitialValues } from '~/routes/console/studios/-configs/default-values';

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
    <ConsolePageList
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

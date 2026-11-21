import { useCallback } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { CommonListQuerySchema } from '@hobbies-collection/shared';
import { getEmptyFormValues } from '~/shared/helpers/get-empty-form-values';
import type { Input } from '~/shared/types/extract-params';
import { api, queryKey } from '~/shared/services/api';
import { getCollectionsListQueryOptions } from '~/shared/helpers/query-options/collections/get-collections-list-query-options';
import { withFormModal } from '~/shared/helpers/with-form-modal';
import { CollectionForm } from '~/routes/console/collections/-components/collection-form/collection-form';
import { useFormModal } from '~/shared/context/form-modal-context';
import { ConsolePageList } from '~/shared/components/console-page-list';

const collectionFormDefaultValues = getEmptyFormValues<Input<typeof api.collections.create>>({
  title: '',
  films: [],
});

export const Route = createFileRoute('/console/collections')({
  validateSearch: (search) => CommonListQuerySchema.parse(search),
  loader: async ({ context: { queryClient }, location }) => {
    await queryClient.ensureQueryData(getCollectionsListQueryOptions(location.search));
  },
  component: withFormModal(CollectionForm, PageContainer),
  staticData: {
    title: 'Collections',
    backPath: '/console',
  },
  head: () => ({
    meta: [
      {
        title: 'Collections - Films Collection',
      },
    ],
  }),
});

const getDeleteMutationsOptions = () => {
  return {
    mutationFn: (id: number) => api.collections.delete({ params: { id } }),
    meta: {
      invalidateQueries: {
        queryKey: queryKey('collections.getList'),
      },
    },
  };
};

function PageContainer() {
  const search = Route.useSearch();
  const { data, isFetching } = useQuery(getCollectionsListQueryOptions(search));
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
      getDeleteMutationOptions={getDeleteMutationsOptions}
      onEdit={(data) => onOpen({ ...data, films: [] })}
      isFetching={isFetching}
      onCreate={() => onOpen(collectionFormDefaultValues)}
      createItemTitle="New collection"
      onSearch={handleSearch}
      onPageChange={handlePageChange}
    />
  );
}

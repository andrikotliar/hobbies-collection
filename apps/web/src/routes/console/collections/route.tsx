import { createFileRoute } from '@tanstack/react-router';
import {
  getCollectionsListQueryOptions,
  getEmptyFormValues,
  api,
  type Input,
  queryKey,
} from '~/shared';
import { List, useFormModal, withFormModal } from '~/routes/console/-shared';
import { CollectionForm } from '~/routes/console/collections/-components';
import type z from 'zod';
import type { CollectionFormSchema } from '~/routes/console/collections/-schemas';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { CommonListQuerySchema } from '@hobbies-collection/shared';

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
  const { onOpen } = useFormModal<z.infer<typeof CollectionFormSchema>>();
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

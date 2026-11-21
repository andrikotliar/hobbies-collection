import { createFileRoute } from '@tanstack/react-router';
import { mutationOptions, useQuery } from '@tanstack/react-query';
import { CommonListQuerySchema } from '@hobbies-collection/shared';
import { useCallback } from 'react';
import { getGenresListQueryOptions } from '~/shared/helpers/query-options/genres/get-genres-list-query-options';
import { withFormModal } from '~/shared/helpers/with-form-modal';
import { GenresForm } from '~/routes/console/genres/-components/genres-form';
import { getEmptyFormValues } from '~/shared/helpers/get-empty-form-values';
import type { Input } from '~/shared/types/extract-params';
import { api, queryKey } from '~/shared/services/api';
import { useFormModal } from '~/shared/context/form-modal-context';
import { ConsolePageList } from '~/shared/components/console-page-list/console-page-list';

export const Route = createFileRoute('/console/genres')({
  validateSearch: (search) => CommonListQuerySchema.parse(search),
  loader: async ({ context: { queryClient }, location }) => {
    return await queryClient.ensureQueryData(getGenresListQueryOptions(location.search));
  },
  component: withFormModal(GenresForm, PageContainer),
  staticData: {
    title: 'Genres',
    backPath: '/console',
  },
  head: () => ({
    meta: [
      {
        title: 'Genres - Films Collection',
      },
    ],
  }),
});

const genreDefaultValues = getEmptyFormValues<Input<typeof api.genres.create>>({
  title: '',
});

const getDeleteMutationOptions = () => {
  return mutationOptions({
    mutationFn: (id: number) => api.genres.delete({ params: { id } }),
    meta: {
      invalidateQueries: [
        { queryKey: queryKey('genres.getList') },
        { queryKey: queryKey('initialData.get') },
      ],
    },
  });
};

function PageContainer() {
  const search = Route.useSearch();
  const { data, isFetching } = useQuery(getGenresListQueryOptions(search));
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
      onSearch={handleSearch}
      getDeleteMutationOptions={getDeleteMutationOptions}
      onEdit={onOpen}
      onCreate={() => onOpen(genreDefaultValues)}
      createItemTitle="New genre"
      isFetching={isFetching}
      onPageChange={handlePageChange}
    />
  );
}

import {
  api,
  getCountriesListQueryOptions,
  getEmptyFormValues,
  queryKey,
  type Input,
} from '~/shared';
import { List, useFormModal, withFormModal } from '~/routes/console/-shared';
import { createFileRoute } from '@tanstack/react-router';
import { CountryForm } from '~/routes/console/countries/-components';
import { mutationOptions, useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { CommonListQuerySchema } from '@hobbies-collection/shared';

const countryDefaultValues = getEmptyFormValues<Input<typeof api.countries.create>>({
  title: '',
});

export const Route = createFileRoute('/console/countries')({
  validateSearch: (search) => CommonListQuerySchema.parse(search),
  loader: async ({ context: { queryClient }, location }) => {
    return await queryClient.ensureQueryData(getCountriesListQueryOptions(location.search));
  },
  component: withFormModal(CountryForm, PageContainer),
  staticData: {
    title: 'Countries',
    backPath: '/console',
  },
  head: () => ({
    meta: [
      {
        title: 'Countries - Films Collection',
      },
    ],
  }),
});

const getDeleteMutationOptions = () => {
  return mutationOptions({
    mutationFn: (id: number) => api.countries.delete({ params: { id } }),
    meta: {
      invalidateQueries: [
        { queryKey: queryKey('countries.getList') },
        { queryKey: queryKey('initialData.get') },
      ],
    },
  });
};

function PageContainer() {
  const search = Route.useSearch();
  const { data, isFetching } = useQuery(getCountriesListQueryOptions(search));
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
      onCreate={() => onOpen(countryDefaultValues)}
      onSearch={handleSearch}
      onPageChange={handlePageChange}
    />
  );
}

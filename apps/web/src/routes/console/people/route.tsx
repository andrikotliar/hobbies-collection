import {
  api,
  buildMetaTitle,
  countObjectKeys,
  FiltersSidebar,
  filterValues,
  getEmptyFormValues,
  buildGetPeopleAdminListQueryOptions,
  queryKey,
  useSidebarVisibility,
  type FilterItem,
  type Input,
} from '~/shared';
import { ContentWithSidebar, List, useFormModal, withFormModal } from '~/routes/console/-shared';
import { PersonForm } from '~/routes/console/people/-components';
import { createFileRoute } from '@tanstack/react-router';
import {
  convertEnumValuesToOption,
  GetPeopleListQuerySchema,
  PersonRole,
  enumValues,
} from '@hobbies-collection/shared';
import { mutationOptions, useQuery } from '@tanstack/react-query';
import type { z } from 'zod';
import { useCallback, useMemo } from 'react';

const personDefaultValues = getEmptyFormValues<Input<typeof api.people.create>>({
  name: '',
  selected: false,
});

const filtersConfig: Array<FilterItem<z.infer<typeof GetPeopleListQuerySchema>>> = [
  {
    id: 'selected',
    title: 'Content',
    type: 'boolean',
    options: [
      {
        id: 'selected',
        label: 'Selected',
      },
      {
        id: 'notAssigned',
        label: 'Not assigned',
      },
    ],
  },
  {
    id: 'role',
    title: 'Role',
    type: 'checkmark',
    options: convertEnumValuesToOption(enumValues(PersonRole)),
    inputType: 'radio',
  },
];

const defaultFilters: z.infer<typeof GetPeopleListQuerySchema> = {
  selected: false,
  notAssigned: false,
  role: null,
};

const getDeleteMutationOptions = () => {
  return mutationOptions({
    mutationFn: (id: number) => api.people.delete({ params: { id } }),
    meta: {
      invalidateQueries: { queryKey: queryKey('people.getList') },
    },
  });
};

export const Route = createFileRoute('/console/people')({
  validateSearch: (search) => {
    return GetPeopleListQuerySchema.parse(search);
  },
  loader: async ({ context: { queryClient }, location }) => {
    return await queryClient.ensureQueryData(buildGetPeopleAdminListQueryOptions(location.search));
  },
  component: withFormModal(PersonForm, RouteComponent),
  staticData: {
    title: 'Crew and Cast',
    backPath: '/console',
  },
  head: () => ({
    meta: [
      {
        title: buildMetaTitle('Crew and Cast'),
      },
    ],
  }),
});

function RouteComponent() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { onOpen } = useFormModal();
  const { isFilterOpen, toggleFilter, hideFilter } = useSidebarVisibility('/console/people');

  const { data, isFetching } = useQuery(buildGetPeopleAdminListQueryOptions(search));

  const handleChangePage = (pageIndex: number) => {
    navigate({
      search: (values) => ({
        ...values,
        pageIndex,
      }),
    });
  };

  const handleSearch = useCallback((value: string) => {
    navigate({
      search: (values) => ({
        ...values,
        q: value,
      }),
    });
  }, []);

  const appliedFilters = countObjectKeys(search, ['pageIndex', 'q']);

  const initialFilters = useMemo(() => {
    return {
      ...defaultFilters,
      ...search,
    };
  }, [search]);

  const filterPeople = (data: z.infer<typeof GetPeopleListQuerySchema>) => {
    const appliedFilters = filterValues(data);
    navigate({
      search: (values) => ({
        ...values,
        ...appliedFilters,
      }),
    });
    hideFilter();
  };

  const handleReset = () => {
    navigate({
      to: '/console/people',
    });
    hideFilter();
  };

  return (
    <ContentWithSidebar>
      <FiltersSidebar
        isOpen={isFilterOpen}
        onToggle={toggleFilter}
        heightReducer="60px"
        topPositionMargin="80px"
        defaultValues={initialFilters}
        config={filtersConfig}
        schema={GetPeopleListQuerySchema}
        filtersCount={appliedFilters}
        resetValues={defaultFilters}
        onSubmit={filterPeople}
        onReset={handleReset}
      />
      <List
        data={data}
        titleKey="name"
        onSearch={handleSearch}
        getDeleteMutationOptions={getDeleteMutationOptions}
        onEdit={onOpen}
        isFetching={isFetching}
        onPageChange={handleChangePage}
        onCreate={() => onOpen(personDefaultValues)}
        createItemTitle="New crew or cast member"
      />
    </ContentWithSidebar>
  );
}

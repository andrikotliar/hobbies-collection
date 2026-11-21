import { createFileRoute } from '@tanstack/react-router';
import {
  convertEnumValuesToOption,
  enumValues,
  GetPeopleListQuerySchema,
  PersonRole,
} from '@hobbies-collection/shared';
import { mutationOptions, useQuery } from '@tanstack/react-query';
import type { z } from 'zod';
import { useCallback, useMemo } from 'react';
import { getEmptyFormValues } from '~/shared/helpers/get-empty-form-values';
import type { Input } from '~/shared/types/extract-params';
import { api, queryKey } from '~/shared/services/api';
import type { FilterItem } from '~/shared/types/filter';
import { withFormModal } from '~/shared/helpers/with-form-modal';
import { PersonForm } from '~/routes/console/people/-components/person-form/person-form';
import { useFormModal } from '~/shared/context/form-modal-context';
import { useSidebarVisibility } from '~/shared/hooks/use-sidebar-visibility';
import { countObjectKeys } from '~/shared/helpers/count-keys';
import { filterValues } from '~/shared/helpers/filter-values';
import { ContentWithSidebar } from '~/shared/components/content-with-sidebar/content-with-sidebar';
import { FiltersSidebar } from '~/shared/components/filters-sidebar/filters-sidebar';
import { Filters } from '~/shared/components/filters/filters';
import { ConsolePageList } from '~/shared/components/console-page-list/console-page-list';
import { getPeopleAdminListQueryOptions } from '~/shared/helpers/query-options/people/get-people-admin-list-query-options';

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
    return await queryClient.ensureQueryData(getPeopleAdminListQueryOptions(location.search));
  },
  component: withFormModal(PersonForm, RouteComponent),
  staticData: {
    title: 'Crew and Cast',
    backPath: '/console',
  },
  head: () => ({
    meta: [
      {
        title: 'Crew and Cast - Films Collection',
      },
    ],
  }),
});

function RouteComponent() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { onOpen } = useFormModal();
  const { isFilterOpen, toggleFilter, hideFilter } = useSidebarVisibility('/console/people');

  const { data, isFetching } = useQuery(getPeopleAdminListQueryOptions(search));

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
        pageIndex: 0,
      }),
    });
  }, []);

  const appliedFilters = countObjectKeys(search, ['pageIndex', 'q', 'filmId']);

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
        pageIndex: 0,
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
      >
        <Filters
          defaultValues={initialFilters}
          config={filtersConfig}
          schema={GetPeopleListQuerySchema}
          filtersCount={appliedFilters}
          resetValues={defaultFilters}
          onSubmit={filterPeople}
          onReset={handleReset}
        />
      </FiltersSidebar>
      <ConsolePageList
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

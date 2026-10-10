import {
  Filters,
  buildGetFilmsAdminListQueryOptions,
  buildGetInitialDataQueryOptions,
  useSidebarVisibility,
  filterValues,
  countObjectKeys,
  api,
  FiltersSidebar,
  type SortingParams,
  queryKey,
  buildMetaTitle,
} from '~/shared';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { GetAdminListQuerySchema, type ListOption } from '@hobbies-collection/shared';
import { mutationOptions, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import {
  AdminFiltersSchema,
  defaultAdminFilters,
  getAdminFiltersConfig,
} from '~/routes/console/films/-helpers';
import { ContentWithSidebar, List, useFormModal, withFormModal } from '~/routes/console/-shared';
import { FormIcon } from 'lucide-react';
import { QuickEditForm } from '~/routes/console/films/-components';

export const Route = createFileRoute('/console/films')({
  validateSearch: (search) => {
    return GetAdminListQuerySchema.parse(search);
  },
  loader: async ({ context, location }) => {
    await context.queryClient.ensureQueryData(buildGetFilmsAdminListQueryOptions(location.search));
    await context.queryClient.ensureQueryData(buildGetInitialDataQueryOptions());
  },
  component: withFormModal(QuickEditForm, PageContainer),
  staticData: {
    title: 'Films',
    backPath: '/console',
  },
  head: () => ({
    meta: [
      {
        title: buildMetaTitle('Films'),
      },
    ],
  }),
});

const getDeleteMutationOptions = () => {
  return mutationOptions({
    mutationFn: (id: number) => api.films.delete({ params: { id } }),
    meta: {
      invalidateQueries: [
        { queryKey: queryKey('films.getAdminList') },
        { queryKey: queryKey('films.getList') },
      ],
    },
  });
};

const sortingFields: ListOption<string>[] = [
  {
    label: 'Updated At',
    value: 'updatedAt',
  },
  {
    label: 'Latest added',
    value: 'addedAt',
  },
  {
    label: 'Release Date',
    value: 'releaseDate',
  },
  {
    label: 'Title',
    value: 'title',
  },
];

function PageContainer() {
  const searchParams = Route.useSearch();
  const navigate = Route.useNavigate();
  const { data, isFetching } = useQuery(buildGetFilmsAdminListQueryOptions(searchParams));
  const { data: initialData, isFetching: isInitialDataFetching } = useSuspenseQuery(
    buildGetInitialDataQueryOptions(),
  );

  const { onOpen: handleOptionQuickForm } = useFormModal();

  const { isFilterOpen, toggleFilter, hideFilter } = useSidebarVisibility('/console/films');

  const handlePageChange = (pageIndex: number) => {
    navigate({
      search: (params) => ({
        ...params,
        pageIndex,
      }),
    });
  };

  const handleEditFilm = (data: { id: number }) => {
    navigate({
      to: '/console/films/$id',
      params: { id: data.id.toString() },
      search: searchParams,
    });
  };

  const handleViewFilm = (data: { id: number }) => {
    navigate({
      to: '/console/films/view/$id',
      params: { id: data.id.toString() },
      search: (prev) => prev,
    });
  };

  const filterFilms: React.ComponentProps<typeof Filters>['onSubmit'] = (data) => {
    const appliedFilters = filterValues(data);

    const searchParams = {
      ...appliedFilters,
      pageIndex: 0,
    };

    navigate({
      search: searchParams,
    });
    hideFilter();
  };

  const handleReset = () => {
    navigate({
      to: '/console/films',
      search: {
        pageIndex: 0,
      },
    });
    hideFilter();
  };

  const filtersConfig = useMemo(() => {
    return getAdminFiltersConfig(initialData);
  }, [initialData]);

  const initialFilters = useMemo(() => {
    return {
      ...defaultAdminFilters,
      ...searchParams,
    };
  }, [searchParams]);

  const filtersCount = countObjectKeys(searchParams, ['pageIndex', 'order', 'orderKey', 'q']);

  const handleSearch = useCallback((value: string) => {
    navigate({
      search: (params) => ({
        ...params,
        pageIndex: 0,
        q: value,
      }),
    });
  }, []);

  const handleApplySorting = useCallback((sorting: SortingParams) => {
    navigate({
      search: (params) => ({
        ...params,
        ...sorting,
      }),
    });
  }, []);

  return (
    <>
      <ContentWithSidebar>
        <FiltersSidebar
          isLoading={isInitialDataFetching}
          isOpen={isFilterOpen}
          onToggle={toggleFilter}
          heightReducer="60px"
          topPositionMargin="80px"
        >
          <Filters
            config={filtersConfig}
            defaultValues={initialFilters}
            resetValues={defaultAdminFilters}
            onSubmit={filterFilms}
            schema={AdminFiltersSchema}
            filtersCount={filtersCount}
            onReset={handleReset}
          />
        </FiltersSidebar>
        <List
          data={data}
          getDeleteMutationOptions={getDeleteMutationOptions}
          onEdit={handleEditFilm}
          onView={handleViewFilm}
          onSearch={handleSearch}
          isFetching={isFetching}
          onNavigateToForm="/console/films/$id"
          createItemTitle="New film"
          onPageChange={handlePageChange}
          sorting={{
            fields: sortingFields,
            apply: handleApplySorting,
          }}
          additionalHandlers={[
            {
              id: 'quickEdit',
              icon: <FormIcon />,
              action: ({ id }) => handleOptionQuickForm({ id }),
            },
          ]}
        />
      </ContentWithSidebar>
      <Outlet />
    </>
  );
}

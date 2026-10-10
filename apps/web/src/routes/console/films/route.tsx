import {
  buildGetFilmsAdminListQueryOptions,
  buildGetInitialDataQueryOptions,
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
import { useCallback, useMemo, useState } from 'react';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { onOpen: handleOptionQuickForm } = useFormModal();

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

  const filterFilms: React.ComponentProps<typeof FiltersSidebar>['onSubmit'] = (data) => {
    const appliedFilters = filterValues(data);

    const searchParams = {
      ...appliedFilters,
      pageIndex: 0,
    };

    navigate({
      search: searchParams,
    });
    setIsSidebarOpen(false);
  };

  const handleReset = () => {
    navigate({
      to: '/console/films',
      search: {
        pageIndex: 0,
      },
    });
    setIsSidebarOpen(false);
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
    <ContentWithSidebar>
      <FiltersSidebar
        isLoading={isInitialDataFetching}
        isOpen={isSidebarOpen}
        onToggle={setIsSidebarOpen}
        heightReducer="60px"
        topPositionMargin="80px"
        config={filtersConfig}
        defaultValues={initialFilters}
        resetValues={defaultAdminFilters}
        onSubmit={filterFilms}
        schema={AdminFiltersSchema}
        filtersCount={filtersCount}
        onReset={handleReset}
      />
      <List
        data={data}
        getDeleteMutationOptions={getDeleteMutationOptions}
        onEdit={handleEditFilm}
        onView={handleViewFilm}
        onSearch={handleSearch}
        isFetching={isFetching}
        filterCount={filtersCount}
        onNavigateToForm="/console/films/$id"
        createItemTitle="New film"
        onPageChange={handlePageChange}
        onOpenMobileFilter={() => setIsSidebarOpen(true)}
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
      <Outlet />
    </ContentWithSidebar>
  );
}

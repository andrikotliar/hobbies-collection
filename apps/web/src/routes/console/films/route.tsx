import type z from 'zod';
import { createFileRoute } from '@tanstack/react-router';
import { useCallback, useMemo } from 'react';
import { mutationOptions, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { GetAdminListQuerySchema, type ListOption } from '@hobbies-collection/shared';
import { getFilmsAdminListQueryOptions } from '~/shared/helpers/query-options/films/get-films-admin-list-query-options';
import { getInitialDataQueryOptions } from '~/shared/helpers/query-options/initial-data/get-initial-data-query-options';
import { api, queryKey } from '~/shared/services/api';
import { useSidebarVisibility } from '~/shared/hooks/use-sidebar-visibility';
import { Filters } from '~/shared/components/filters/filters';
import { filterValues } from '~/shared/helpers/filter-values';
import {
  AdminFiltersSchema,
  defaultAdminFilters,
  getAdminFiltersConfig,
} from '~/routes/console/films/-helpers/get-admin-filters-config';
import { countObjectKeys } from '~/shared/helpers/count-keys';
import type { SortingParams } from '~/shared/components/sorting-popup/sorting-popup';
import { ContentWithSidebar } from '~/shared/components/content-with-sidebar';
import { FiltersSidebar } from '~/shared/components/filters-sidebar/filters-sidebar';
import { ConsolePageList } from '~/shared/components/console-page-list';

export const Route = createFileRoute('/console/films')({
  validateSearch: (search) => {
    return GetAdminListQuerySchema.parse(search);
  },
  loader: async ({ context, location }) => {
    await context.queryClient.ensureQueryData(getFilmsAdminListQueryOptions(location.search));
    await context.queryClient.ensureQueryData(getInitialDataQueryOptions());
  },
  component: PageContainer,
  staticData: {
    title: 'Films',
    backPath: '/console',
  },
  head: () => ({
    meta: [
      {
        title: 'Films - Films Collection',
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
  const searchParams = Route.useSearch({
    select: ({ filmId: _, ...params }) => params,
  });
  const navigate = Route.useNavigate();
  const { data, isFetching } = useQuery(getFilmsAdminListQueryOptions(searchParams));
  const { data: initialData, isFetching: isInitialDataFetching } = useSuspenseQuery(
    getInitialDataQueryOptions(),
  );

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
      search: (prev) => ({
        ...prev,
        filmId: data.id,
      }),
    });
  };

  const filterFilms = (data: z.infer<typeof AdminFiltersSchema>) => {
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
        pageIndex: 0,
      }),
    });
  }, []);

  return (
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
      <ConsolePageList
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
      />
    </ContentWithSidebar>
  );
}

import type z from 'zod';
import { useMemo } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { GetFilmsListQuerySchema } from '@hobbies-collection/shared';
import { getFilmsListQueryOptions } from '~/shared/helpers/query-options/films/get-films-list-query-options';
import { useSidebarVisibility } from '~/shared/hooks/use-sidebar-visibility';
import { getInitialDataQueryOptions } from '~/shared/helpers/query-options/initial-data/get-initial-data-query-options';
import {
  filterDefaultValues,
  FiltersSchema,
  getFiltersConfig,
} from '~/shared/configs/root-filters-config';
import { Filters } from '~/shared/components/filters/filters';
import { filterValues } from '~/shared/helpers/filter-values';
import { countObjectKeys } from '~/shared/helpers/count-keys';
import { FilmsSection } from '~/routes/_home/-components/films-section';
import { FiltersSidebar } from '~/shared/components/filters/filters-sidebar';

export const Route = createFileRoute('/_home/')({
  validateSearch: (search) => {
    return GetFilmsListQuerySchema.parse(search);
  },
  loader: async ({ context, location }) => {
    const { filmId: _, ...search } = location.search as Record<string, any>;
    return await context.queryClient.ensureQueryData(getFilmsListQueryOptions(search));
  },
  component: RootPageContainer,
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.allFilmsCount
          ? `Films Collection (${loaderData?.allFilmsCount} films)`
          : 'Films Collection',
      },
    ],
  }),
});

function RootPageContainer() {
  const routeSearch = Route.useSearch();
  const navigate = Route.useNavigate();
  const { isFilterOpen, hideFilter, toggleFilter } = useSidebarVisibility('/');

  const { data: initialData, isFetching: isInitialDataLoading } = useSuspenseQuery(
    getInitialDataQueryOptions(),
  );

  const filtersConfig = useMemo(() => {
    if (!initialData) {
      return [];
    }

    return getFiltersConfig(initialData);
  }, [initialData]);

  const submitFilter = (data: z.infer<typeof FiltersSchema>) => {
    const filledOptions = filterValues(data);
    navigate({
      search: (prev) => ({
        ...prev,
        ...filledOptions,
        pageIndex: 0,
      }),
    });
    hideFilter();
  };

  const handleReset = () => {
    navigate({
      to: '/',
    });
    hideFilter();
  };

  const initialFilters = useMemo(() => {
    return {
      ...filterDefaultValues,
      ...routeSearch,
    };
  }, [routeSearch]);

  const filtersCount = countObjectKeys(routeSearch, ['pageIndex', 'filmId']);

  return (
    <div className="min-h-screen md:min-h-auto flex gap-5 p-5 w-full">
      <FilmsSection />
      <FiltersSidebar
        isLoading={isInitialDataLoading}
        topPositionMargin="20px"
        heightReducer="0px"
        isOpen={isFilterOpen}
        onToggle={toggleFilter}
      >
        <Filters
          defaultValues={initialFilters}
          resetValues={filterDefaultValues}
          onSubmit={submitFilter}
          schema={FiltersSchema}
          onReset={handleReset}
          filtersCount={filtersCount}
          config={filtersConfig}
        />
      </FiltersSidebar>
    </div>
  );
}

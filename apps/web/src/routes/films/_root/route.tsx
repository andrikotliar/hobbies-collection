import { useMemo } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { GetFilmsListQuerySchema } from '@hobbies-collection/shared';
import {
  APP_TITLE,
  buildGetFilmsListQueryOptions,
  buildGetInitialDataQueryOptions,
  countObjectKeys,
  Filters,
  FiltersSidebar,
  filterValues,
  PageLayout,
  useSidebarVisibility,
} from '~/shared';
import { FilmsSection } from './-components/index.js';
import {
  filterDefaultValues,
  FiltersSchema,
  getFiltersConfig,
} from '~/routes/films/_root/-helpers';

export const Route = createFileRoute('/films/_root')({
  validateSearch: (search) => {
    return GetFilmsListQuerySchema.parse(search);
  },
  loader: async ({ context, location }) => {
    const { filmId: _, ...search } = location.search as Record<string, any>;
    return await context.queryClient.ensureQueryData(buildGetFilmsListQueryOptions(search));
  },
  component: RootPageContainer,
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.allFilmsCount
          ? `${APP_TITLE} (${loaderData?.allFilmsCount} films)`
          : APP_TITLE,
      },
    ],
  }),
});

function RootPageContainer() {
  const routeSearch = Route.useSearch();
  const navigate = Route.useNavigate();
  const { isFilterOpen, hideFilter, toggleFilter } = useSidebarVisibility('/');

  const { data: initialData, isFetching: isInitialDataLoading } = useSuspenseQuery(
    buildGetInitialDataQueryOptions(),
  );

  const filtersConfig = useMemo(() => {
    if (!initialData) {
      return [];
    }

    return getFiltersConfig(initialData);
  }, [initialData]);

  const submitFilter: React.ComponentProps<typeof Filters>['onSubmit'] = (data) => {
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
    <PageLayout>
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
    </PageLayout>
  );
}

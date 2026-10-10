import { useMemo, useState } from 'react';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { GetFilmsListQuerySchema } from '@hobbies-collection/shared';
import {
  APP_TITLE,
  buildGetFilmsListQueryOptions,
  buildGetInitialDataQueryOptions,
  countObjectKeys,
  FiltersSidebar,
  filterValues,
  PageLayout,
  filterDefaultValues,
  FiltersSchema,
  getFiltersConfig,
} from '~/shared';
import { FilmsSection } from './-components/index.js';

export const Route = createFileRoute('/films')({
  validateSearch: (search) => {
    return GetFilmsListQuerySchema.parse(search);
  },
  loader: async ({ context, location }) => {
    return await context.queryClient.ensureQueryData(
      buildGetFilmsListQueryOptions(location.search),
    );
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { data: initialData, isFetching: isInitialDataLoading } = useSuspenseQuery(
    buildGetInitialDataQueryOptions(),
  );

  const filtersConfig = useMemo(() => {
    if (!initialData) {
      return [];
    }

    return getFiltersConfig(initialData);
  }, [initialData]);

  const submitFilter: React.ComponentProps<typeof FiltersSidebar>['onSubmit'] = (data) => {
    const filledOptions = filterValues(data);
    navigate({
      search: (prev) => ({
        ...prev,
        ...filledOptions,
        pageIndex: 0,
      }),
    });
    setIsSidebarOpen(false);
  };

  const handleReset = () => {
    navigate({
      to: '/',
    });
    setIsSidebarOpen(false);
  };

  const initialFilters = useMemo(() => {
    return {
      ...filterDefaultValues,
      ...routeSearch,
    };
  }, [routeSearch]);

  const filtersCount = countObjectKeys(routeSearch, ['pageIndex']);

  return (
    <PageLayout>
      <FilmsSection onToggleFilter={() => setIsSidebarOpen(true)} />
      <FiltersSidebar
        isLoading={isInitialDataLoading}
        topPositionMargin="20px"
        heightReducer="0px"
        isOpen={isSidebarOpen}
        onToggle={setIsSidebarOpen}
        defaultValues={initialFilters}
        resetValues={filterDefaultValues}
        onSubmit={submitFilter}
        schema={FiltersSchema}
        onReset={handleReset}
        filtersCount={filtersCount}
        config={filtersConfig}
      />
      <Outlet />
    </PageLayout>
  );
}

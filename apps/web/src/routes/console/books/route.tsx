import { BooksAdminListQueryParamsSchema, type ListOption } from '@hobbies-collection/shared';
import { mutationOptions, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useCallback, useMemo, useState } from 'react';
import { ContentWithSidebar, List, useFormModal, withFormModal } from '~/routes/console/-shared';
import { BookForm } from '~/routes/console/books/-components';
import { getBookFormBaseDefaultValues } from '~/routes/console/books/-configs';
import {
  api,
  booksAdminFiltersDefaultConfig,
  BooksAdminFiltersSchema,
  buildGetBooksAdminListQueryOptions,
  buildGetInitialDataQueryOptions,
  countObjectKeys,
  FiltersSidebar,
  filterValues,
  getBooksAdminFiltersConfig,
  queryKey,
  type SortingParams,
} from '~/shared';

export const Route = createFileRoute('/console/books')({
  validateSearch: (search) => BooksAdminListQueryParamsSchema.parse(search),
  loader: async ({ location, context }) => {
    await context.queryClient.ensureQueryData(buildGetBooksAdminListQueryOptions(location.search));
    await context.queryClient.ensureQueryData(buildGetInitialDataQueryOptions());
  },
  component: withFormModal(BookForm, RouteComponent),
  staticData: {
    title: 'Books',
    backPath: '/console',
  },
});

const getDeleteMutationOptions = () => {
  return mutationOptions({
    mutationFn: async (id: number) => api.books.deleteBook({ params: { id } }),
    meta: {
      invalidateQueries: [
        { queryKey: queryKey('books.getList') },
        { queryKey: queryKey('books.getAdminList') },
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
    label: 'Reading Order',
    value: 'readingOrder',
  },
];

function RouteComponent() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { data, isLoading } = useQuery(buildGetBooksAdminListQueryOptions(search));
  const { data: initialData } = useSuspenseQuery(buildGetInitialDataQueryOptions());
  const { onOpen } = useFormModal();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSearch = useCallback((value: string) => {
    navigate({
      search: (params) => ({
        ...params,
        pageIndex: 0,
        q: value,
      }),
    });
  }, []);

  const handleSorting = (params: SortingParams) => {
    navigate({
      search: (prev) => ({
        ...prev,
        pageIndex: 0,
        order: params.order,
        orderKey: params.orderKey,
      }),
    });
  };

  const filtersCount = countObjectKeys(search, ['order', 'orderKey', 'pageIndex', 'q']);

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
      to: '/console/books',
    });
    setIsSidebarOpen(false);
  };

  const handlePagination = (pageIndex: number) => {
    navigate({
      search: (prev) => ({ ...prev, pageIndex }),
    });
  };

  const filtersConfig = useMemo(() => {
    return getBooksAdminFiltersConfig(initialData, search.authorIds);
  }, [initialData, search]);

  return (
    <ContentWithSidebar>
      <FiltersSidebar
        isOpen={isSidebarOpen}
        onToggle={setIsSidebarOpen}
        defaultValues={{ ...booksAdminFiltersDefaultConfig, ...search }}
        schema={BooksAdminFiltersSchema}
        onSubmit={submitFilter}
        resetValues={booksAdminFiltersDefaultConfig}
        config={filtersConfig}
        filtersCount={filtersCount}
        onReset={handleReset}
        heightReducer="60px"
        topPositionMargin="80px"
      />
      <List
        data={data}
        isFetching={isLoading}
        getDeleteMutationOptions={getDeleteMutationOptions}
        onEdit={onOpen}
        onSearch={handleSearch}
        sorting={{ apply: handleSorting, fields: sortingFields }}
        onCreate={() => onOpen(getBookFormBaseDefaultValues())}
        onOpenMobileFilter={() => setIsSidebarOpen(true)}
        onPageChange={handlePagination}
      />
    </ContentWithSidebar>
  );
}

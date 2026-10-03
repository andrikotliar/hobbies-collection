import { queryOptions } from '@tanstack/react-query';
import { api, queryKey } from '~/shared/services';

export const buildGetBooksListQueryOptions = () => {
  return queryOptions({
    queryKey: [queryKey('books.getList')],
    queryFn: () => api.books.getList({ queryParams: {} }),
  });
};

export const buildGetBookQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: queryKey('books.getBook', id),
    queryFn: () => api.books.getBook({ params: { id: Number(id) } }),
  });
};

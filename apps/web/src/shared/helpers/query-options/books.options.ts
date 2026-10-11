import { queryOptions } from '@tanstack/react-query';
import { isNewItem } from '~/shared/helpers/is-new-item';
import { api, queryKey } from '~/shared/services';
import type { MixedId, QueryParams } from '~/shared/types';

export const buildGetBooksListQueryOptions = (
  queryParams: QueryParams<typeof api.books.getList>,
) => {
  return queryOptions({
    queryKey: queryKey('books.getList', queryParams),
    queryFn: () => api.books.getList({ queryParams }),
  });
};

export const buildGetBookQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: queryKey('books.getBook', id),
    queryFn: () => api.books.getBook({ params: { id: Number(id) } }),
  });
};

export const buildGetBooksAdminListQueryOptions = (
  queryParams: QueryParams<typeof api.books.getAdminList>,
) => {
  return queryOptions({
    queryKey: queryKey('books.getAdminList', queryParams),
    queryFn: () => api.books.getAdminList({ queryParams }),
  });
};

export const buildGetBookSeriesQueryOptions = (id?: MixedId | null) => {
  return queryOptions({
    enabled: !!id && !isNewItem(id),
    queryKey: queryKey('books.getSeries', id),
    queryFn: async () => {
      if (!id || isNewItem(id)) {
        return [];
      }

      return api.books.getSeries({ params: { id } });
    },
  });
};

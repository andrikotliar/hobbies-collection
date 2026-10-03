import { queryOptions } from '@tanstack/react-query';
import { api, queryKey } from '~/shared/services';
import type { QueryParams } from '~/shared/types';

export const buildGetAllCollectionOptionsQueryOptions = () => {
  return queryOptions({
    queryKey: queryKey('collections.getAll'),
    queryFn: api.collections.getAll,
    staleTime: Infinity,
  });
};

export const buildGetCollectionsListQueryOptions = (
  queryParams: QueryParams<typeof api.collections.getList>,
) => {
  return queryOptions({
    queryKey: queryKey('collections.getList', queryParams),
    queryFn: () => api.collections.getList({ queryParams }),
  });
};

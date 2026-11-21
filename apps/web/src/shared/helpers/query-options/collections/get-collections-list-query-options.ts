import { queryOptions } from '@tanstack/react-query';
import { api, queryKey } from '~/shared/services/api';
import type { QueryParams } from '~/shared/types/extract-params';

export const getCollectionsListQueryOptions = (
  queryParams: QueryParams<typeof api.collections.getList>,
) => {
  return queryOptions({
    queryKey: queryKey('collections.getList', queryParams),
    queryFn: () => api.collections.getList({ queryParams }),
  });
};

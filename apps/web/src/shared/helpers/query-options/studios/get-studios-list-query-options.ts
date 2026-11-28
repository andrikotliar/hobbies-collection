import { queryOptions } from '@tanstack/react-query';
import { api, queryKey } from '~/shared/services/api';
import type { QueryParams } from '~/shared/types/extract-params';

export const getStudiosListQueryOptions = (
  queryParams: QueryParams<typeof api.studios.getList>,
) => {
  return queryOptions({
    queryKey: queryKey('studios.getList', queryParams),
    queryFn: () => api.studios.getList({ queryParams }),
  });
};

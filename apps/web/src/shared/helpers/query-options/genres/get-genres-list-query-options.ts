import { queryOptions } from '@tanstack/react-query';
import { api, queryKey } from '~/shared/services/api';
import type { QueryParams } from '~/shared/types/extract-params';

export const getGenresListQueryOptions = (queryParams: QueryParams<typeof api.genres.getList>) => {
  return queryOptions({
    queryKey: queryKey('genres.getList', queryParams),
    queryFn: () => api.genres.getList({ queryParams }),
  });
};

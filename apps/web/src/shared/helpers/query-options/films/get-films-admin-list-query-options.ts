import { queryOptions } from '@tanstack/react-query';
import { api, queryKey } from '~/shared/services/api';
import type { QueryParams } from '~/shared/types/extract-params';

export const getFilmsAdminListQueryOptions = (
  queryParams: QueryParams<typeof api.films.getAdminList>,
) => {
  return queryOptions({
    queryKey: queryKey('films.getAdminList', queryParams),
    queryFn: () => api.films.getAdminList({ queryParams }),
  });
};

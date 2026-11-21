import { queryOptions } from '@tanstack/react-query';
import { api, queryKey } from '~/shared/services/api';
import type { QueryParams } from '~/shared/types/extract-params';

export const getAwardsBaseDataListQueryOptions = (
  queryParams: QueryParams<typeof api.awards.getList>,
) => {
  return queryOptions({
    queryKey: queryKey('awards.getList', queryParams),
    queryFn: () => api.awards.getList({ queryParams }),
  });
};

import { queryOptions } from '@tanstack/react-query';
import { api, queryKey } from '~/shared/services/api';
import type { QueryParams } from '~/shared/types/extract-params';

export const getCountriesListQueryOptions = (
  queryParams: QueryParams<typeof api.countries.getList>,
) => {
  return queryOptions({
    queryKey: queryKey('countries.getList', queryParams),
    queryFn: () => api.countries.getList({ queryParams }),
  });
};

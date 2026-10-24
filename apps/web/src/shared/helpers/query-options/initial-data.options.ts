import { api, queryKey } from '~/shared/services';
import { queryOptions } from '@tanstack/react-query';

export const buildGetInitialDataQueryOptions = () => {
  return queryOptions({
    queryKey: queryKey('initialData.get'),
    queryFn: api.initialData.get,
    staleTime: Infinity,
  });
};

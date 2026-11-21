import { queryOptions } from '@tanstack/react-query';
import { api, queryKey } from '~/shared/services/api';

export const getInitialDataQueryOptions = () => {
  return queryOptions({
    queryKey: queryKey('initialData.get'),
    queryFn: api.initialData.get,
    staleTime: Infinity,
  });
};

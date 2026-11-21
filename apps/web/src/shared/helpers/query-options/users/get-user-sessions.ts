import { queryOptions } from '@tanstack/react-query';
import { api, queryKey } from '~/shared/services/api';

export const getUserSessionsQueryOptions = () => {
  return queryOptions({
    queryKey: queryKey('users.getSessions'),
    queryFn: api.users.getSessions,
  });
};

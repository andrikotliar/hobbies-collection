import { queryOptions } from '@tanstack/react-query';
import { api, queryKey } from '~/shared/services/api';

export const getUserDataQueryOptions = () => {
  return queryOptions({
    queryKey: queryKey('users.getUser'),
    queryFn: api.users.getUser,
  });
};

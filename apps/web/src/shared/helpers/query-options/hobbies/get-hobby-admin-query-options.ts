import { queryOptions } from '@tanstack/react-query';
import { api, queryKey } from '~/shared/services/api';

export const getHobbyAdminQueryOptions = (hobbyId: number) => {
  return queryOptions({
    queryKey: queryKey('hobbies.getHobbyAdmin', hobbyId),
    queryFn: () => api.hobbies.getHobbyAdmin({ params: { id: hobbyId }, queryParams: {} }),
  });
};

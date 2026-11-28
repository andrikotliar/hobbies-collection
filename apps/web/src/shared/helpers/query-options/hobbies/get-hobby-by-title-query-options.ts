import { queryOptions } from '@tanstack/react-query';
import { api, queryKey } from '~/shared/services/api';

export const getHobbyByTitleQueryOptions = (title: string) => {
  return queryOptions({
    queryKey: queryKey('hobbies.getHobbyByTitle', title),
    queryFn: () => api.hobbies.getHobbyByTitle({ params: { title } }),
  });
};

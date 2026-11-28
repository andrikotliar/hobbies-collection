import { queryOptions } from '@tanstack/react-query';
import { api, queryKey } from '~/shared/services/api';

export const getHobbyRelatedCollectionsQueryOptions = (hobbyId: string) => {
  return queryOptions({
    queryKey: queryKey('hobbies.getHobbiesByCollection', hobbyId),
    queryFn: () => api.collections.getHobbyRelated({ params: { id: Number(hobbyId) } }),
    staleTime: Infinity,
  });
};

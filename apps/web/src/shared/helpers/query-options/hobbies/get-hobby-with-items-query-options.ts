import { queryOptions } from '@tanstack/react-query';
import { api, queryKey } from '~/shared/services/api';
import type { QueryParams } from '~/shared/types/extract-params';

export const getHobbyWithItemsQueryOptions = (
  id: string,
  queryParams: QueryParams<typeof api.hobbies.getHobby>,
) => {
  return queryOptions({
    queryKey: queryKey('hobbies.getHobby', id, queryParams),
    queryFn: () => api.hobbies.getHobby({ params: { id: Number(id) }, queryParams }),
  });
};

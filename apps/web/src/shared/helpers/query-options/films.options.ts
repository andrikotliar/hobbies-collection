import { queryOptions } from '@tanstack/react-query';
import { api, queryKey } from '~/shared/services/api';

export const buildGetFilmChaptersQueryOptions = (id?: number | null) => {
  return queryOptions({
    queryKey: [queryKey('films.getFilmChapters', id)],
    queryFn: () => {
      if (!id) {
        return [];
      }

      return api.films.getFilmChapters({ params: { id } });
    },
    enabled: !!id,
  });
};

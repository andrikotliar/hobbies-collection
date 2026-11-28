import { queryOptions } from '@tanstack/react-query';
import { api, queryKey } from '~/shared/services/api';

export const getFilmDraftsQueryOptions = (filmId: string) => {
  return queryOptions({
    queryKey: queryKey('films.getFilmDrafts', filmId),
    queryFn: async () => {
      return api.films.getFilmDrafts({ params: { filmId } });
    },
  });
};

import { queryOptions } from '@tanstack/react-query';
import { api, queryKey } from '~/shared/services/api';

export const getFilmsStatsQueryOptions = () => {
  return queryOptions({
    queryKey: queryKey('films.getFilmStats'),
    queryFn: api.films.getFilmStats,
    staleTime: Infinity,
  });
};

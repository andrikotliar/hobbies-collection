import { queryOptions } from '@tanstack/react-query';
import { api, queryKey } from '~/shared/services/api';

export const getFilmQueryOptions = (filmId: number) => {
  return queryOptions({
    queryKey: ['filmQuery', ...queryKey('films.getById', filmId)],
    queryFn: () => api.films.getById({ params: { id: filmId } }),
    staleTime: Infinity,
  });
};

export const getAdminFilmQueryOptions = (filmId: number) => {
  return queryOptions({
    queryKey: ['filmQuery', ...queryKey('films.getAdminFilmById', filmId)],
    queryFn: () => api.films.getAdminFilmById({ params: { id: filmId } }),
    staleTime: Infinity,
  });
};

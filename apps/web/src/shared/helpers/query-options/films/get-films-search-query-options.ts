import { api, queryKey } from '~/shared/services/api';
import { queryOptions } from '@tanstack/react-query';

export const getFilmsSearchQueryOptions = (searchString: string | null) => {
  return queryOptions({
    queryKey: queryKey('films.search', searchString),
    queryFn: async () => {
      if (!searchString) {
        return null;
      }

      return await api.films.search({ queryParams: { q: searchString } });
    },
    enabled: !!searchString?.length,
  });
};

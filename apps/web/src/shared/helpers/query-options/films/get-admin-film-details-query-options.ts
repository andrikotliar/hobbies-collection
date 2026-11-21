import { queryOptions } from '@tanstack/react-query';
import { isNewItem } from '~/shared/helpers/is-new-item';
import { api, queryKey } from '~/shared/services/api';
import type { MixedId } from '~/shared/types/mixed-id';

export const getAdminFilmDetailsQueryOptions = (id: MixedId) => {
  return queryOptions({
    queryKey: queryKey('films.getEditableFilm', id),
    queryFn: () => {
      if (isNewItem(id)) {
        return null;
      }

      return api.films.getEditableFilm({ params: { id } });
    },
    enabled: !isNewItem(id),
  });
};

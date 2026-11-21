import { queryOptions } from '@tanstack/react-query';
import { isNewItem } from '~/shared/helpers/is-new-item';
import { api, queryKey } from '~/shared/services/api';
import type { MixedId } from '~/shared/types/mixed-id';

export const getHobbyItemsByCollectionQueryOptions = (collectionId: MixedId) => {
  return queryOptions({
    queryKey: queryKey('hobbies.getHobbiesByCollection', collectionId),
    queryFn: async () => {
      if (isNewItem(collectionId)) {
        return;
      }
      return await api.hobbies.getHobbiesByCollection({ params: { id: collectionId } });
    },
    enabled: !!collectionId && !isNewItem(collectionId),
  });
};

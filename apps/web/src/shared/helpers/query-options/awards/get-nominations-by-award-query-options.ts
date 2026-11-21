import { queryOptions } from '@tanstack/react-query';
import { api, queryKey } from '~/shared/services/api';

export const getNominationsByAwardQueryOptions = (awardId: number | null) => {
  return queryOptions({
    queryKey: queryKey('awards.getNominations', awardId),
    queryFn: () => api.awards.getNominations({ params: { id: awardId } }),
    enabled: Boolean(awardId),
  });
};

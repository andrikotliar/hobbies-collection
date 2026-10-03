import { queryOptions } from '@tanstack/react-query';
import { api, queryKey } from '~/shared/services';

export const buildGetBoardGamesListQueryOptions = () => {
  return queryOptions({
    queryKey: [queryKey('boardGames.getGamesList')],
    queryFn: () => api.boardGames.getGamesList({ queryParams: {} }),
  });
};

export const buildGetBoardGameQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: queryKey('boardGames.getGame', id),
    queryFn: () => api.boardGames.getGame({ params: { id: Number(id) } }),
  });
};

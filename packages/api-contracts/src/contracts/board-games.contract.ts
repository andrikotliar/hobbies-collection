import {
  BoardGameInputSchema,
  BoardGameSchema,
  BoardGameResponseSchema,
  BoardGamesListQueryParamsSchema,
  BoardGamesListResponseSchema,
  BoardGameUpdateInputSchema,
  IdParamSchema,
} from '@hobbies-collection/shared';
import { createContract } from '../helpers/define-contracts.js';

export const boardGamesContract = {
  getGamesList: createContract({
    url: '/board-games',
    method: 'GET',
    schema: {
      querystring: BoardGamesListQueryParamsSchema,
      response: BoardGamesListResponseSchema,
    },
  }),
  getGame: createContract({
    url: '/board-games/:id',
    method: 'GET',
    schema: {
      params: IdParamSchema,
      response: BoardGameResponseSchema,
    },
  }),
  createGame: createContract({
    url: '/board-games',
    method: 'POST',
    schema: {
      body: BoardGameInputSchema,
      response: BoardGameSchema,
    },
  }),
  updateGame: createContract({
    url: '/board-games/:id',
    method: 'PATCH',
    schema: {
      params: IdParamSchema,
      body: BoardGameUpdateInputSchema,
      response: BoardGameSchema,
    },
  }),
  deleteGame: createContract({
    url: '/board-games/:id',
    method: 'DELETE',
    schema: {
      params: IdParamSchema,
      response: IdParamSchema,
    },
  }),
};

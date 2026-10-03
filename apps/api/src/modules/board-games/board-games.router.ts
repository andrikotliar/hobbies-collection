import { contracts } from '@hobbies-collection/contracts';
import { createRouter } from '~/shared/helpers/create-router.js';
import { validateAuth } from '~/shared/pre-handlers/validate-auth.js';

export const boardGamesRouter = createRouter(contracts.boardGames, {
  getGame: {
    handler: async ({ app, request }) => {
      const data = await app.resolve('boardGamesService').getBoardGame(request.params.id);

      return { data };
    },
  },
  getGamesList: {
    handler: async ({ app, request }) => {
      const data = await app.resolve('boardGamesService').getList(request.query);

      return { data };
    },
  },
  createGame: {
    preHandler: [validateAuth],
    handler: async ({ app, request }) => {
      const data = await app.resolve('boardGamesService').createBoardGame(request.body);

      return { data };
    },
  },
  updateGame: {
    preHandler: [validateAuth],
    handler: async ({ app, request }) => {
      const data = await app
        .resolve('boardGamesService')
        .updateBoardGame(request.params.id, request.body);

      return { data };
    },
  },
  deleteGame: {
    preHandler: [validateAuth],
    handler: async ({ app, request }) => {
      await app.resolve('boardGamesService').deleteBoardGame(request.params.id);

      return { data: { id: request.params.id } };
    },
  },
});

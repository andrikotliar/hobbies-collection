import { contracts } from '@hobbies-collection/contracts';
import { NotFoundException } from '~/shared/exceptions/not-found.js';
import { createRouter } from '~/shared/helpers/create-router.js';
import { getRequestUser } from '~/shared/helpers/get-request-user.js';
import { validateAuth } from '~/shared/pre-handlers/validate-auth.js';
import { validateGetSignature } from '~/shared/pre-handlers/validate-get-signature.js';

export const filmsRouter = createRouter(contracts.films, {
  getList: {
    handler: async ({ request, app }) => {
      const data = await app.resolve('filmsService').getFilteredFilms(request.query);

      return { data };
    },
  },

  search: {
    handler: async ({ request, app }) => {
      const data = await app.resolve('filmsService').searchFilm(request.query.q);

      return { data };
    },
  },

  getOptions: {
    handler: async ({ request, app }) => {
      const data = await app.resolve('filmsService').getFilmOptions(request.query);

      return { data };
    },
  },

  getFilmStats: {
    handler: async ({ app }) => {
      const data = await app.resolve('filmsService').getStats();

      return { data };
    },
  },

  getAdminList: {
    preHandler: [validateAuth],
    handler: async ({ request, app }) => {
      const data = await app.resolve('filmsService').getAdminList(request.query);

      return { data };
    },
  },

  getEditableFilm: {
    preHandler: [validateAuth],
    handler: async ({ request, app }) => {
      const data = await app.resolve('filmsService').getEditableFilm(request.params.id);

      return { data };
    },
  },

  export: {
    preHandler: [validateGetSignature],
    handler: async ({ request, app }) => {
      const data = await app.resolve('filmsService').getCompleteData(request.query as any);

      return { data };
    },
  },

  getById: {
    handler: async ({ request, app }) => {
      const data = await app.resolve('filmsService').getFilmDetails(request.params.id);

      if (!data) {
        throw new NotFoundException({
          message: `Film with the ${request.params.id} not found`,
        });
      }

      return { data };
    },
  },

  getTrailers: {
    handler: async ({ request, app }) => {
      const trailers = await app.resolve('filmsService').getFilmTrailers(request.params.id);

      return { data: { trailers } };
    },
  },

  create: {
    preHandler: [validateAuth],
    handler: async ({ request, app }) => {
      const data = await app.resolve('filmsService').createFilm(request.body);

      if (!data) {
        throw new NotFoundException({
          message: 'Create film not found',
        });
      }

      return { data, status: 'CREATED' };
    },
  },

  update: {
    preHandler: [validateAuth],
    handler: async ({ request, app }) => {
      const data = await app.resolve('filmsService').updateFilm(request.params.id, request.body);

      if (!data) {
        throw new NotFoundException({
          message: `Film ${request.params.id} not found`,
        });
      }

      return { data };
    },
  },

  delete: {
    preHandler: [validateAuth],
    handler: async ({ request, app }) => {
      const data = await app.resolve('filmsService').deleteFilm(request.params.id);

      return { data };
    },
  },

  translateDescription: {
    preHandler: [validateAuth],
    handler: async ({ request, app }) => {
      const user = getRequestUser(request);

      const translatedText = await app
        .resolve('filmsService')
        .translateDescription(user.id, request.body);

      return { data: { translatedText } };
    },
  },

  createDraft: {
    preHandler: [validateAuth],
    handler: async ({ request, app }) => {
      const data = await app
        .resolve('filmsService')
        .createDraft(request.params.filmId, request.body);

      return {
        data,
        status: 'CREATED',
      };
    },
  },

  updateDraft: {
    preHandler: [validateAuth],
    handler: async ({ request, app }) => {
      const data = await app.resolve('filmsService').updateDraft(request.params.id, request.body);

      return {
        data,
      };
    },
  },

  getFilmDrafts: {
    preHandler: [validateAuth],
    handler: async ({ request, app }) => {
      const data = await app.resolve('filmsService').getDrafts(request.params.filmId);

      return { data };
    },
  },

  deleteDraft: {
    preHandler: [validateAuth],
    handler: async ({ request, app }) => {
      await app.resolve('filmsService').deleteDraft(request.params.id);

      return { data: { id: request.params.id } };
    },
  },

  getByCollection: {
    preHandler: [validateAuth],
    handler: async ({ request, app }) => {
      const data = await app.resolve('filmsService').getFilmsByCollection(request.params.id);

      return { data };
    },
  },

  deleteAllFilmDrafts: {
    preHandler: [validateAuth],
    handler: async ({ request, app }) => {
      await app.resolve('filmsService').deleteAllFilmDrafts(request.params.filmId);

      return { data: { ok: true } };
    },
  },

  getAdminFilmById: {
    preHandler: [validateAuth],
    handler: async ({ request, app }) => {
      const data = await app.resolve('filmsService').getFilmDetails(request.params.id, 'admin');

      if (!data) {
        throw new NotFoundException({
          message: `Film with the ${request.params.id} not found`,
        });
      }

      return { data };
    },
  },
});

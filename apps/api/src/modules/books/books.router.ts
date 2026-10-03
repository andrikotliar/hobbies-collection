import { contracts } from '@hobbies-collection/contracts';
import { createRouter } from '~/shared/helpers/create-router.js';
import { validateAuth } from '~/shared/pre-handlers/validate-auth.js';

export const booksRouter = createRouter(contracts.books, {
  getBook: {
    handler: async ({ app, request }) => {
      const data = await app.resolve('booksService').getBook(request.params.id);

      return { data };
    },
  },
  getList: {
    handler: async ({ app, request }) => {
      const data = await app.resolve('booksService').getList(request.query);

      return { data };
    },
  },
  createBook: {
    preHandler: [validateAuth],
    handler: async ({ app, request }) => {
      const data = await app.resolve('booksService').createBook(request.body);

      return { data };
    },
  },
  updateBook: {
    preHandler: [validateAuth],
    handler: async ({ app, request }) => {
      const data = await app.resolve('booksService').updateBook(request.params.id, request.body);

      return { data };
    },
  },
  deleteBook: {
    preHandler: [validateAuth],
    handler: async ({ app, request }) => {
      await app.resolve('booksService').deleteBook(request.params.id);

      return { data: { id: request.params.id } };
    },
  },
});

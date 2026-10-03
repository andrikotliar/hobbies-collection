import {
  BookInputSchema,
  BookResponseSchema,
  BookSchema,
  BooksListQueryParamsSchema,
  BooksListResponseSchema,
  BookUpdateSchema,
  IdParamSchema,
} from '@hobbies-collection/shared';
import { createContract } from '../helpers/define-contracts.js';

export const booksContract = {
  getList: createContract({
    url: '/books',
    method: 'GET',
    schema: {
      querystring: BooksListQueryParamsSchema,
      response: BooksListResponseSchema,
    },
  }),
  getBook: createContract({
    url: '/books/:id',
    method: 'GET',
    schema: {
      params: IdParamSchema,
      response: BookResponseSchema,
    },
  }),
  createBook: createContract({
    url: '/books',
    method: 'POST',
    schema: {
      body: BookInputSchema,
      response: BookSchema,
    },
  }),
  updateBook: createContract({
    url: '/books/:id',
    method: 'PATCH',
    schema: {
      body: BookUpdateSchema,
      params: IdParamSchema,
      response: BookSchema,
    },
  }),
  deleteBook: createContract({
    url: '/books/:id',
    method: 'DELETE',
    schema: {
      params: IdParamSchema,
      response: IdParamSchema,
    },
  }),
};

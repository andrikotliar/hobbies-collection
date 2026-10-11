import {
  BookInputSchema,
  BooksSearchQueryParamsSchema,
  BooksSearchResponseSchema,
  BookResponseSchema,
  BooksAdminListQueryParamsSchema,
  BooksAdminListResponseSchema,
  BookSchema,
  BooksListQueryParamsSchema,
  BooksListResponseSchema,
  BookUpdateSchema,
  IdParamSchema,
  BooksSeriesResponseSchema,
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
  getAdminList: createContract({
    url: '/books/admin',
    method: 'GET',
    schema: {
      querystring: BooksAdminListQueryParamsSchema,
      response: BooksAdminListResponseSchema,
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
  getEditableBook: createContract({
    url: '/books/admin/:id',
    method: 'GET',
    schema: {
      params: IdParamSchema,
      response: BookInputSchema,
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
  getReadingOrder: createContract({
    url: '/books/order',
    method: 'GET',
    schema: {
      querystring: BooksSearchQueryParamsSchema,
      response: BooksSearchResponseSchema,
    },
  }),
  search: createContract({
    url: '/books/search',
    method: 'GET',
    schema: {
      querystring: BooksSearchQueryParamsSchema,
      response: BooksSearchResponseSchema,
    },
  }),
  getSeries: createContract({
    url: '/books/series/:id',
    method: 'GET',
    schema: {
      params: IdParamSchema,
      response: BooksSeriesResponseSchema,
    },
  }),
};

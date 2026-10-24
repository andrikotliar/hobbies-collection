import {
  IdParamSchema,
  GetFilmOptionsQuerySchema,
  GetFilmsListQuerySchema,
  SearchFilmsQuerySchema,
  buildListOptionSchema,
  FilmsListResponseSchema,
  FilmsSearchResponseSchema,
  FilmsAdminListResponseSchema,
  FilmResponseSchema,
  CreateFilmInputSchema,
  UpdateFilmInputSchema,
  GetCompleteDataListQuerySchema,
  CompleteDataResponseSchema,
  CreateFilmDraftInputSchema,
  FilmDraftInputResponse,
  FilmDraftFilmIdParamsSchema,
  FilmTrailersResponseSchema,
  GetAdminListQuerySchema,
  FilmStatsResponseSchema,
  FilmsByCollectionResponseSchema,
  DeleteFilmDrafts,
} from '@hobbies-collection/shared';
import { z } from 'zod';
import { createContract } from '../helpers/index.js';

export const filmsContract = {
  getList: createContract({
    method: 'GET',
    url: '/films',
    schema: {
      querystring: GetFilmsListQuerySchema,
      response: FilmsListResponseSchema,
    },
  }),
  search: createContract({
    method: 'GET',
    url: '/films/search',
    schema: {
      querystring: SearchFilmsQuerySchema,
      response: FilmsSearchResponseSchema,
    },
  }),
  getOptions: createContract({
    method: 'GET',
    url: '/films/options',
    schema: {
      querystring: GetFilmOptionsQuerySchema,
      response: buildListOptionSchema(z.number()),
    },
  }),
  getFilmStats: createContract({
    method: 'GET',
    url: '/films/stats',
    schema: {
      response: FilmStatsResponseSchema,
    },
  }),
  getAdminList: createContract({
    method: 'GET',
    url: '/films/admin',
    schema: {
      querystring: GetAdminListQuerySchema,
      response: FilmsAdminListResponseSchema,
    },
  }),
  getEditableFilm: createContract({
    method: 'GET',
    url: '/films/admin/:id',
    schema: {
      params: IdParamSchema,
      response: CreateFilmInputSchema,
    },
  }),
  export: createContract({
    method: 'GET',
    url: '/films/export',
    schema: {
      querystring: GetCompleteDataListQuerySchema,
      response: CompleteDataResponseSchema,
    },
  }),
  getById: createContract({
    method: 'GET',
    url: '/films/:id',
    schema: {
      params: IdParamSchema,
      response: FilmResponseSchema,
    },
  }),
  getTrailers: createContract({
    method: 'GET',
    url: '/films/:id/trailers',
    schema: {
      params: IdParamSchema,
      response: FilmTrailersResponseSchema,
    },
  }),
  create: createContract({
    method: 'POST',
    url: '/films/admin',
    schema: {
      body: CreateFilmInputSchema,
      response: FilmResponseSchema,
    },
  }),
  update: createContract({
    method: 'PATCH',
    url: '/films/admin/:id',
    schema: {
      body: UpdateFilmInputSchema,
      params: IdParamSchema,
      response: FilmResponseSchema,
    },
  }),
  delete: createContract({
    method: 'DELETE',
    url: '/films/admin/:id',
    schema: {
      params: IdParamSchema,
      response: IdParamSchema,
    },
  }),
  createDraft: createContract({
    method: 'POST',
    url: '/films/admin/:filmId/draft',
    schema: {
      params: FilmDraftFilmIdParamsSchema,
      body: CreateFilmDraftInputSchema,
      response: FilmDraftInputResponse,
    },
  }),
  updateDraft: createContract({
    method: 'PATCH',
    url: '/films/admin/draft/:id',
    schema: {
      params: IdParamSchema,
      body: CreateFilmDraftInputSchema,
      response: FilmDraftInputResponse,
    },
  }),
  getFilmDrafts: createContract({
    method: 'GET',
    url: '/films/admin/:filmId/draft',
    schema: {
      params: FilmDraftFilmIdParamsSchema,
      response: z.array(FilmDraftInputResponse),
    },
  }),
  deleteDraft: createContract({
    method: 'DELETE',
    url: '/films/admin/draft/:id',
    schema: {
      params: IdParamSchema,
      response: IdParamSchema,
    },
  }),
  getByCollection: createContract({
    method: 'GET',
    url: '/films/collection/:id',
    schema: {
      params: IdParamSchema,
      response: FilmsByCollectionResponseSchema,
    },
  }),
  getAdminFilmById: createContract({
    method: 'GET',
    url: '/films/admin/film/:id',
    schema: {
      params: IdParamSchema,
      response: FilmResponseSchema,
    },
  }),
  deleteAllFilmDrafts: createContract({
    method: 'DELETE',
    url: '/films/admin/film/:filmId/drafts',
    schema: {
      params: FilmDraftFilmIdParamsSchema,
      response: DeleteFilmDrafts,
    },
  }),
};

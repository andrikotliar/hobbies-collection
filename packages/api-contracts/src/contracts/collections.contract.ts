import {
  IdParamSchema,
  CreateCollectionInputSchema,
  UpdateCollectionInputSchema,
  CollectionsListResponseSchema,
  CollectionResponseSchema,
  CommonListQuerySchema,
  buildListOptionSchema,
} from '@hobbies-collection/shared';
import z from 'zod';
import { createContract } from '../helpers/index.js';

export const collectionsContract = {
  getList: createContract({
    method: 'GET',
    url: '/collections',
    schema: {
      querystring: CommonListQuerySchema,
      response: CollectionsListResponseSchema,
    },
  }),
  create: createContract({
    method: 'POST',
    url: '/collections',
    schema: {
      body: CreateCollectionInputSchema,
      response: CollectionResponseSchema,
    },
  }),
  update: createContract({
    method: 'PATCH',
    url: '/collections/:id',
    schema: {
      params: IdParamSchema,
      body: UpdateCollectionInputSchema,
      response: CollectionResponseSchema,
    },
  }),
  delete: createContract({
    method: 'DELETE',
    url: '/collections/:id',
    schema: {
      params: IdParamSchema,
      response: IdParamSchema,
    },
  }),
  getAll: createContract({
    method: 'GET',
    url: '/collections/all',
    schema: {
      response: buildListOptionSchema(z.number()),
    },
  }),
  getHobbyRelated: createContract({
    method: 'GET',
    url: '/collections/hobby/:id',
    schema: {
      params: IdParamSchema,
      response: buildListOptionSchema(z.number()),
    },
  }),
};

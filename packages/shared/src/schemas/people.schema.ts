import { z } from 'zod';
import { PersonRole } from '../enums/index.js';
import { getArrayFromQuery, getBoolFromQuery, getListResponseSchema } from '../helpers/index.js';
import { buildListQueryParamsSchema } from '../helpers/build-list-query-params-schema.js';

export const CreatePersonSchema = z.object({
  name: z.string(),
  selected: z.boolean().optional(),
});

export const GetPeopleListQuerySchema = buildListQueryParamsSchema(
  z.object({
    role: z.enum(PersonRole).nullable().optional(),
    selected: getBoolFromQuery.optional(),
    notAssigned: getBoolFromQuery.optional(),
  }),
);

export const SearchPersonSchema = z
  .object({
    q: z.string(),
    selected: getArrayFromQuery(z.coerce.number()),
  })
  .partial();

export const UpdatePersonInputSchema = CreatePersonSchema.partial();

export const PersonResponseSchema = z.object({
  id: z.coerce.number(),
  name: z.string(),
  selected: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const PeopleListResponseSchema = getListResponseSchema(
  z.array(PersonResponseSchema.pick({ id: true, name: true, selected: true })),
);

export type GetPeopleListQuery = z.infer<typeof GetPeopleListQuerySchema>;
export type CreatePersonInput = z.infer<typeof CreatePersonSchema>;
export type UpdatePersonInput = z.infer<typeof UpdatePersonInputSchema>;
export type SearchPersonQuery = z.infer<typeof SearchPersonSchema>;
export type PeopleListResponse = z.infer<typeof PeopleListResponseSchema>;

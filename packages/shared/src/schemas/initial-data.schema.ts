import { z } from 'zod';
import { buildListOptionSchema } from './list-options.schema.js';

export const InitialDataResponseSchema = z.object({
  options: z.object({
    collections: buildListOptionSchema(z.coerce.number()),
    genres: buildListOptionSchema(z.coerce.number()),
    countries: buildListOptionSchema(z.coerce.number()),
    studios: buildListOptionSchema(z.coerce.number()),
    types: buildListOptionSchema(z.string()),
    roles: buildListOptionSchema(z.string()),
    awards: buildListOptionSchema(z.coerce.number()),
    selectedPeople: buildListOptionSchema(z.coerce.number()),
  }),
});

export type InitialDataResponse = z.infer<typeof InitialDataResponseSchema>;

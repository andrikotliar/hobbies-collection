import { z } from 'zod';
import { buildListQueryParamsSchema } from '../helpers/build-list-query-params-schema.js';
import { PersonResponseSchema } from './people.schema.js';

export const BoardGameInputSchema = z.object({
  title: z.string(),
  description: z.string(),
  mainGameId: z.number().nullable().optional(),
  gamesPlayed: z.number(),
  releasedYear: z.number().min(2000),
  rating: z.number().min(1).max(3),
  imagePath: z.string().nullable().optional(),
  creators: z.array(z.number()),
});

export const BoardGameUpdateInputSchema = BoardGameInputSchema.partial();

export const BoardGameSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  gamesPlayed: z.number().nullable(),
  releasedYear: z.number(),
  rating: z.number(),
  imagePath: z.string().nullable(),
});

export const BoardGameResponseSchema = BoardGameSchema.extend({
  creators: z.array(PersonResponseSchema.pick({ id: true, name: true })),
  expansions: z.array(
    z.object({
      title: z.string(),
      imagePath: z.string().nullable(),
      releasedYear: z.number(),
    }),
  ),
});

export const BoardGamesListResponseSchema = z.array(
  BoardGameResponseSchema.pick({ id: true, title: true, releasedYear: true, imagePath: true }),
);

export const BoardGamesListQueryParamsSchema = buildListQueryParamsSchema();

export type BoardGameResponse = z.infer<typeof BoardGameResponseSchema>;
export type BoardGamesListResponse = z.infer<typeof BoardGamesListResponseSchema>;
export type BoardGameInput = z.infer<typeof BoardGameInputSchema>;
export type BoardGameUpdateInput = z.infer<typeof BoardGameUpdateInputSchema>;
export type BoardGamesListQueryParams = z.infer<typeof BoardGamesListQueryParamsSchema>;

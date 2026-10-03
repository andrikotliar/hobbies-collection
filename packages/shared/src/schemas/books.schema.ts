import { z } from 'zod';
import { buildListQueryParamsSchema } from '../helpers/index.js';
import { PersonResponseSchema } from './people.schema.js';
import { GenreResponseSchema } from './genres.schema.js';

export const BookInputSchema = z.object({
  title: z.string(),
  description: z.string(),
  imagePath: z.string().nullable(),
  publicationYear: z.number().min(1000),
  pagesNumber: z.number().min(1),
  rating: z.number().min(1).max(3),
  authors: z.array(z.number()),
  genres: z.array(z.number()),
  collections: z.array(z.number()),
});

export const BookUpdateSchema = BookInputSchema.partial();

export const BookSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  publicationYear: z.number(),
  pagesNumber: z.number(),
  rating: z.number(),
  imagePath: z.string().nullable(),
});

export const BooksListResponseSchema = z.array(
  BookSchema.pick({ id: true, title: true, imagePath: true, publicationYear: true }),
);

export const BooksListQueryParamsSchema = buildListQueryParamsSchema();

export const BookResponseSchema = BookSchema.extend({
  authors: z.array(PersonResponseSchema.pick({ id: true, name: true })),
  genres: z.array(GenreResponseSchema.pick({ id: true, name: true })),
  collections: z.array(z.number()),
});

export type BookInput = z.infer<typeof BookInputSchema>;
export type BookUpdateInput = z.infer<typeof BookUpdateSchema>;
export type BookListResponse = z.infer<typeof BooksListResponseSchema>;
export type BooksListQueryParams = z.infer<typeof BooksListQueryParamsSchema>;
export type BookResponse = z.infer<typeof BookResponseSchema>;

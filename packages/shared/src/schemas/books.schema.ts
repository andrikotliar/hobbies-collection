import { z } from 'zod';
import {
  buildListQueryParamsSchema,
  getArrayFromQuery,
  getListResponseSchema,
} from '../helpers/index.js';
import { PersonResponseSchema } from './people.schema.js';
import { GenreResponseSchema } from './genres.schema.js';
import { BookReadStatus } from '../enums/book-read-status.enum.js';
import { buildListOptionSchema } from './list-options.schema.js';

export const BookInputSchema = z.object({
  title: z.string(),
  description: z.string().nullable(),
  imagePath: z.string().nullable(),
  publicationYear: z.coerce.number().min(1000).nullable(),
  pagesNumber: z.coerce.number().min(1).nullable(),
  rating: z.number().min(1).max(3).nullable(),
  authors: z.array(z.number()),
  genres: z.array(z.number()),
  firstBookId: z.coerce.number().nullable().optional(),
  seriesOrder: z.coerce.number(),
  readingOrder: z.number(),
  status: z.enum(BookReadStatus),
});

export const BookUpdateSchema = BookInputSchema.partial();

export const BookSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  publicationYear: z.number().nullable(),
  pagesNumber: z.number().nullable(),
  rating: z.number().nullable(),
  imagePath: z.string().nullable(),
});

export const BooksListResponseSchema = z.array(
  BookSchema.pick({ id: true, title: true, imagePath: true, publicationYear: true }),
);

export const BooksSeriesResponseSchema = z.array(
  z.object({
    id: z.number(),
    title: z.string(),
    imagePath: z.string().nullable(),
    order: z.number().nullable(),
  }),
);

const BooksListFilters = z.object({
  genreIds: getArrayFromQuery(z.coerce.number()),
  authorIds: getArrayFromQuery(z.coerce.number()),
  rating: z.coerce.number(),
});

export const BooksListQueryParamsSchema = buildListQueryParamsSchema(BooksListFilters.partial());

export const BooksAdminListQueryParamsSchema = buildListQueryParamsSchema(
  z
    .object({
      ...BooksListFilters.shape,
      status: z.enum(BookReadStatus),
    })
    .partial(),
);

export const BookResponseSchema = BookSchema.extend({
  authors: z.array(PersonResponseSchema.pick({ id: true, name: true })),
  genres: z.array(GenreResponseSchema.pick({ id: true, name: true })),
});

export const BooksAdminListResponseSchema = getListResponseSchema(BooksListResponseSchema);

export const BooksSearchQueryParamsSchema = z.object({
  q: z.string().optional(),
  selected: getArrayFromQuery(z.coerce.number()).optional(),
});

export const BooksSearchResponseSchema = buildListOptionSchema(z.number());

export type BookInput = z.infer<typeof BookInputSchema>;
export type BookUpdateInput = z.infer<typeof BookUpdateSchema>;
export type BookListResponse = z.infer<typeof BooksListResponseSchema>;
export type BooksListQueryParams = z.infer<typeof BooksListQueryParamsSchema>;
export type BooksAdminListQueryParams = z.infer<typeof BooksAdminListQueryParamsSchema>;
export type BookResponse = z.infer<typeof BookResponseSchema>;
export type BookAdminListResponse = z.infer<typeof BooksAdminListResponseSchema>;
export type BooksSearchResponse = z.infer<typeof BooksSearchResponseSchema>;

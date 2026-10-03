import { z } from 'zod';
import { getListResponseSchema } from '../helpers/index.js';
import { buildListQueryParamsSchema } from '../helpers/build-list-query-params-schema.js';

export const GetArticleBySlugSchema = z.object({
  slug: z.string(),
});

export const GetArticlesListQueriesSchema = buildListQueryParamsSchema();

export const CreateArticleSchema = z.object({
  title: z.string(),
  slug: z.string().regex(/^[a-z-]*$/),
  content: z.string(),
});

export const UpdateArticleSchema = CreateArticleSchema.partial();

export const ArticleResponseSchema = z.object({
  id: z.coerce.number(),
  title: z.string(),
  content: z.string(),
  slug: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ArticlesListResponseSchema = getListResponseSchema(
  z.array(
    ArticleResponseSchema.omit({ createdAt: true, updatedAt: true }).extend({
      shortContent: z.string(),
    }),
  ),
);

export const ArticleBySlugResponseSchema = ArticleResponseSchema.pick({
  id: true,
  title: true,
  content: true,
});

export const ArticleByIdResponseSchema = ArticleResponseSchema.omit({
  createdAt: true,
  updatedAt: true,
}).nullable();

export type ArticleBySlugParams = z.infer<typeof GetArticleBySlugSchema>;
export type ArticlesListQueries = z.infer<typeof GetArticlesListQueriesSchema>;
export type CreateArticleInput = z.infer<typeof CreateArticleSchema>;
export type UpdateArticleInput = z.infer<typeof UpdateArticleSchema>;
export type ArticlesListResponse = z.infer<typeof ArticlesListResponseSchema>;

import { z } from 'zod';

const ListQueryParamsSchema = z.object({
  pageIndex: z.coerce.number().min(0).optional(),
  orderKey: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  q: z.string().optional().nullable(),
});

export function buildListQueryParamsSchema(): typeof ListQueryParamsSchema;
export function buildListQueryParamsSchema<T extends z.ZodObject>(
  mainSchema: T,
): typeof ListQueryParamsSchema & T;
export function buildListQueryParamsSchema<T extends z.ZodObject>(mainSchema?: T) {
  if (!mainSchema) {
    return ListQueryParamsSchema;
  }
  return z.object({ ...ListQueryParamsSchema.shape, ...mainSchema.shape });
}

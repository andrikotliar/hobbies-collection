import { z } from 'zod';
import { getListResponseSchema } from '../helpers/index.js';

export const CreateCollectionInputSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  films: z.array(
    z.object({
      filmId: z.number(),
      order: z.number().min(0.1, 'Order is required'),
      title: z.string(),
    }),
  ),
});

export const UpdateCollectionInputSchema = CreateCollectionInputSchema.partial();

export const CollectionResponseSchema = z.object({
  id: z.coerce.number(),
  title: z.string(),
  description: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CollectionsListResponseSchema = getListResponseSchema(
  z.array(
    CollectionResponseSchema.pick({
      id: true,
      title: true,
    }),
  ),
);

export type CreateCollectionInput = z.infer<typeof CreateCollectionInputSchema>;
export type UpdateCollectionInput = z.infer<typeof UpdateCollectionInputSchema>;
export type CollectionsListResponse = z.infer<typeof CollectionsListResponseSchema>;

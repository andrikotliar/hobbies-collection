import { BookInputSchema } from '@hobbies-collection/shared';
import z from 'zod';
import { FormIdParamSchema } from '~/shared';

export const BookFormSchema = BookInputSchema.extend({
  id: FormIdParamSchema,
  imagePath: z.union([z.string(), z.file()]).nullable().optional(),
});

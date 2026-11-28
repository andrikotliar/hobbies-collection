import { CreateFilmInputSchema } from '@hobbies-collection/shared';
import { z } from 'zod';
import { FormIdParamSchema } from './form-id.schema';

export const FilmFormSchema = z.object({
  ...CreateFilmInputSchema.shape,
  imagePath: z.union([z.string(), z.file()]).nullable().optional(),
  id: FormIdParamSchema,
});

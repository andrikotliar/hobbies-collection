import { HobbyItemInputSchema } from '@hobbies-collection/shared';
import z from 'zod';
import { FormIdParamSchema } from '~/shared/schemas/form-id.schema';

export const HobbyItemFormSchema = HobbyItemInputSchema.extend({
  id: FormIdParamSchema,
  imagePath: z.union([z.string(), z.file()]).nullable().optional(),
});

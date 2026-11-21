import { HobbyMutationSchema } from '@hobbies-collection/shared';
import z from 'zod';
import { FormIdParamSchema } from '~/shared/schemas/form-id.schema';

export const HobbyFormSchema = HobbyMutationSchema.extend({
  id: FormIdParamSchema,
  imagePath: z.union([z.file(), z.string()]).optional().nullable(),
});

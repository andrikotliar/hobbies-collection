import { GenreInputSchema } from '@hobbies-collection/shared';
import { FormIdParamSchema } from '~/shared/schemas/form-id.schema';

export const GenreFormSchema = GenreInputSchema.extend({
  id: FormIdParamSchema,
});

import { CreatePersonSchema } from '@hobbies-collection/shared';
import { FormIdParamSchema } from '~/shared/schemas/form-id.schema';

export const PersonFormSchema = CreatePersonSchema.extend({
  id: FormIdParamSchema,
});

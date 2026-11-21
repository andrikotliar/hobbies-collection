import { CreateAwardInputSchema } from '@hobbies-collection/shared';
import { FormIdParamSchema } from '~/shared/schemas/form-id.schema';

export const AwardFormSchema = CreateAwardInputSchema.extend({
  id: FormIdParamSchema,
});

import { StudioInputSchema } from '@hobbies-collection/shared';
import { FormIdParamSchema } from './form-id.schema';

export const StudioFormSchema = StudioInputSchema.extend({
  id: FormIdParamSchema,
});

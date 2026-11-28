import { CountryInputSchema } from '@hobbies-collection/shared';
import { FormIdParamSchema } from '~/shared/schemas/form-id.schema';

export const CountryFormSchema = CountryInputSchema.extend({
  id: FormIdParamSchema,
});

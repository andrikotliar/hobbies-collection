import { CreateCollectionEventInputSchema } from '@hobbies-collection/shared';
import { z } from 'zod';
import { FormIdParamSchema } from '~/shared/schemas/form-id.schema';

export const CollectionEventFormSchema = CreateCollectionEventInputSchema.extend({
  id: FormIdParamSchema,
  isOneDayEvent: z.boolean(),
});

import { CreateCollectionInputSchema } from '@hobbies-collection/shared';
import { FormIdParamSchema } from '~/shared/schemas/form-id.schema';

export const CollectionFormSchema = CreateCollectionInputSchema.extend({ id: FormIdParamSchema });

import { getEmptyFormValues } from '~/shared/helpers/get-empty-form-values';
import type { api } from '~/shared/services/api';
import type { Input } from '~/shared/types/extract-params';

export const studioInitialValues = getEmptyFormValues<Input<typeof api.studios.create>>({
  title: '',
});

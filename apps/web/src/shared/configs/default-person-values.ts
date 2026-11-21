import { getEmptyFormValues } from '~/shared/helpers/get-empty-form-values';
import type { api } from '~/shared/services/api';
import type { Input } from '~/shared/types/extract-params';

export const defaultPersonValues = getEmptyFormValues<Input<typeof api.people.create>>({
  name: '',
});

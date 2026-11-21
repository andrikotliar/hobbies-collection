import { getEmptyFormValues } from '~/shared/helpers/get-empty-form-values';
import type { api } from '~/shared/services/api';
import type { ApiResponse } from '~/shared/types/extract-params';

export const getFormDefaultValues = (data: ApiResponse<typeof api.awards.getById> | null) => {
  if (data) {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      nominations: data.nominations,
    };
  }

  return getEmptyFormValues({
    title: '',
    description: null,
    nominations: [],
  });
};

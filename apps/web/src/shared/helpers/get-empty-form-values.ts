import { NEW_ITEM_ID } from '@hobbies-collection/shared';
import type { Entity } from '~/shared/types/entity';

export const getEmptyFormValues = <T extends Record<string, unknown>>(values: T): Entity<T> => {
  return {
    ...values,
    id: NEW_ITEM_ID,
  };
};

import { NEW_ITEM_ID } from '@hobbies-collection/shared';
import type { MixedId } from '~/shared/types/mixed-id';

export const isNewItem = (id: MixedId | string): id is typeof NEW_ITEM_ID => {
  return id === NEW_ITEM_ID;
};

import { isNewItem } from '~/shared/helpers/is-new-item';
import type { MixedId } from '~/shared/types/mixed-id';

export const getMixedId = (id: MixedId | string) => {
  if (isNewItem(id)) {
    return id;
  }

  return Number(id);
};

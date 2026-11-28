import { NEW_ITEM_ID } from '@hobbies-collection/shared';
import type { api } from '~/shared/services/api';
import type { Input } from '~/shared/types/extract-params';

export const getDefaultHobbyItem = (): Input<typeof api.hobbies.createHobbyItem> & {
  id: typeof NEW_ITEM_ID;
} => ({
  id: NEW_ITEM_ID,
  title: '',
  description: '',
  releaseYear: new Date().getFullYear(),
  collections: [],
  people: [],
});

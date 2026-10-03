import type { SortingOrder } from '@hobbies-collection/shared';
import { asc, desc } from 'drizzle-orm';
const directions = {
  asc,
  desc,
};
export const getDirectionFn = (direction: SortingOrder = 'desc') => {
  return directions[direction];
};

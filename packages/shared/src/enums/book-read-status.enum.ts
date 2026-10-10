import type { Enum } from '../types/enum.type.js';

export const BookReadStatus = {
  READ: 'READ',
  PLANNED: 'PLANNED',
} as const;

export type TBookReadStatus = Enum<typeof BookReadStatus>;

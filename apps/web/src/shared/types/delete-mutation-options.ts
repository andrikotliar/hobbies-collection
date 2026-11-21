import type { UseMutationOptions } from '@tanstack/react-query';

export type GetDeleteMutationOptions = () => UseMutationOptions<
  {
    id: number;
  },
  Error,
  number,
  unknown
>;

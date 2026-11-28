import { isNewItem } from '~/shared/helpers/is-new-item';
import type { Entity } from '~/shared/types/entity';
import type { Input } from '~/shared/types/extract-params';

export const mutateEntity = <
  TCreateFunction extends (args: { input: any }) => Promise<unknown>,
  TUpdateFunction extends (args: { input: any; params: { id: number } }) => Promise<unknown>,
>(
  createFn: TCreateFunction,
  updateFn: TUpdateFunction,
) => {
  return ({ id, ...input }: Entity<Input<TCreateFunction>>) => {
    if (isNewItem(id)) {
      return createFn({
        input,
      });
    }

    return updateFn({
      params: {
        id,
      },
      input,
    });
  };
};

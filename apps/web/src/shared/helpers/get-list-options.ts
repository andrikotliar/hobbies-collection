import type { ListOption } from '@hobbies-collection/shared';

type Value = {
  title: string;
  id: number;
};

export const getListOptions = (values: (Value | string)[]): ListOption<number | string>[] => {
  return values.map((value) => {
    if (typeof value === 'string') {
      return {
        label: value,
        value,
      };
    }

    return {
      label: value.title,
      value: value.id,
    };
  });
};

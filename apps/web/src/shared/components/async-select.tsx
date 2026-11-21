import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSelectValue } from '~/shared/components/select/helpers/get-select-value';
import { Select } from '~/shared/components/select/select';
import type { ListOption } from '@hobbies-collection/shared';

type QueryParams = {
  q?: string;
  selected?: any[];
};

export type AsyncSelectProps<T extends ListOption<any>> = {
  optionsLoader: (params: { queryParams: QueryParams }) => Promise<T[]>;
  queryKeyParams: { key: string; values?: unknown };
} & Omit<React.ComponentProps<typeof Select<T>>, 'onOptionsSearch' | 'options'>;

const RETRY_ATTEMPTS_COUNT = 1;

const extractSelectedValue = (value?: unknown) => {
  if (!value) {
    return [];
  }

  if (typeof value === 'number') {
    if (value < 1) {
      return [];
    }

    return getSelectValue(value);
  }

  if (Array.isArray(value) && value.length) {
    const noEmptyValues = value.filter((v) => v > 0);

    return getSelectValue(noEmptyValues);
  }

  return getSelectValue(value);
};

export const AsyncSelect = <T extends ListOption<any>>({
  optionsLoader,
  value,
  isOptionsLoading,
  queryKeyParams,
  ...props
}: AsyncSelectProps<T>) => {
  const [searchString, setSearchString] = useState<string | null>(null);

  const { data: options, isFetching } = useQuery({
    queryKey: [queryKeyParams.key, queryKeyParams.values, searchString] as const,
    queryFn: async ({ queryKey }) => {
      const selectedValues = extractSelectedValue(queryKey[1]);

      const queryParams: QueryParams = {
        selected: selectedValues,
      };

      if (searchString) {
        queryParams.q = searchString;
      }

      return optionsLoader({
        queryParams,
      });
    },
    retry: RETRY_ATTEMPTS_COUNT,
  });

  return (
    <Select
      options={options ?? []}
      onOptionsSearch={setSearchString}
      value={value}
      onClear={() => setSearchString(null)}
      isOptionsLoading={isFetching || isOptionsLoading}
      {...props}
    />
  );
};

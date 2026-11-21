import { type ChangeEvent, useCallback } from 'react';
import { debounce } from '~/shared/helpers/debounce';

type SearchHandler = (value: string) => void | Promise<void>;

export const useDebouncedSearch = (handler: SearchHandler) => {
  const handleSearch = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      if (value.trim().length) {
        handler(value.toLowerCase());
        return;
      }

      handler('');
    },
    [handler],
  );

  const debouncedSearch = debounce(handleSearch, 500);

  return debouncedSearch;
};

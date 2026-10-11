import {
  BookReadStatus,
  BooksAdminListQueryParamsSchema,
  type ListOption,
} from '@hobbies-collection/shared';
import z from 'zod';
import { getListOptions } from '~/shared/helpers';
import { api } from '~/shared/services';
import type { ApiResponse, FilterItem, QueryParams } from '~/shared/types';

export type BooksFiltersConfig = Pick<
  QueryParams<typeof api.books.getList>,
  'authorIds' | 'genreIds'
>;

export type BooksAdminFiltersConfig = Pick<
  QueryParams<typeof api.books.getAdminList>,
  'authorIds' | 'genreIds' | 'status'
>;

const ALL_OPTION: ListOption<string> = {
  label: 'All',
  value: 'all',
};

export const BooksAdminFiltersSchema = z.object({
  ...BooksAdminListQueryParamsSchema.shape,
  status: z.enum({ ...BookReadStatus, all: 'all' }),
});

export const booksFiltersDefaultConfig: BooksFiltersConfig = {
  authorIds: [],
  genreIds: [],
};

export const booksAdminFiltersDefaultConfig: z.infer<typeof BooksAdminFiltersSchema> = {
  authorIds: [],
  genreIds: [],
  status: 'all',
};

export const getBooksFiltersConfig = (
  initialData: ApiResponse<typeof api.initialData.get>,
  selected?: number[],
): Array<FilterItem<BooksFiltersConfig>> => {
  return [
    {
      id: 'genreIds',
      title: 'Genres',
      type: 'checkmark',
      options: initialData.options.genres,
      inputType: 'checkbox',
    },
    {
      id: 'authorIds',
      title: 'Authors',
      type: 'search',
      isMultiple: true,
      loader: api.people.search,
      queryKey: 'authorsSearchFilter',
      selected,
    },
  ];
};

export const getBooksAdminFiltersConfig = (
  initialData: ApiResponse<typeof api.initialData.get>,
  selected?: number[],
): Array<FilterItem<z.infer<typeof BooksAdminFiltersSchema>>> => {
  const baseOptions = getBooksFiltersConfig(initialData, selected);

  const bookReadStatusOptions = getListOptions(Object.values(BookReadStatus));

  return [
    {
      id: 'status',
      title: 'Status',
      type: 'checkmark',
      options: [ALL_OPTION, ...bookReadStatusOptions],
      inputType: 'radio',
    },
    ...baseOptions,
  ];
};

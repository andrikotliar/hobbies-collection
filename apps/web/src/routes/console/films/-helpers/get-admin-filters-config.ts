import { convertEnumValuesToOption, DraftLevel, enumValues } from '@hobbies-collection/shared';
import { z } from 'zod';
import {
  filterDefaultValues,
  FiltersSchema,
  getFiltersConfig,
} from '~/routes/films/_root/-helpers';
import type { api, ApiResponse, FilterItem } from '~/shared';

const AdminOnlyFiltersSchema = z.object({
  noDescription: z.boolean().nullable(),
  draftLevels: z.array(z.enum(DraftLevel)),
  noCrewOrCast: z.boolean().nullable(),
  noBoxOffice: z.boolean().nullable(),
  noTrailers: z.boolean().nullable(),
  incompleteBoxOffice: z.boolean().nullable(),
});

export const AdminFiltersSchema = z.object({
  ...FiltersSchema.shape,
  ...AdminOnlyFiltersSchema.shape,
});

type AdminFilterValues = z.infer<typeof AdminFiltersSchema>;
type AdminOnlyFilterValues = z.infer<typeof AdminOnlyFiltersSchema>;

export const defaultAdminFilters: AdminFilterValues = {
  ...filterDefaultValues,
  noDescription: false,
  noBoxOffice: false,
  noTrailers: false,
  noCrewOrCast: false,
  incompleteBoxOffice: false,
  draftLevels: [],
};

export const getAdminFiltersConfig = (
  initialData: ApiResponse<typeof api.initialData.get>,
): Array<FilterItem<AdminFilterValues>> => {
  const baseFilters = getFiltersConfig(initialData);

  const adminFilters: Array<FilterItem<AdminOnlyFilterValues>> = [
    {
      id: 'draftLevels',
      type: 'checkmark',
      title: 'Draft levels',
      options: convertEnumValuesToOption(enumValues(DraftLevel)),
      inputType: 'checkbox',
    },
    {
      id: 'noDescription',
      title: 'Content',
      type: 'boolean',
      options: [
        {
          id: 'noDescription',
          label: 'Missing description',
        },
        {
          id: 'noBoxOffice',
          label: 'Missing box office',
        },
        {
          id: 'noTrailers',
          label: 'Missing trailers',
        },
        {
          id: 'noCrewOrCast',
          label: 'Missing crew or cast data',
        },
        {
          id: 'incompleteBoxOffice',
          label: 'Incomplete box office',
        },
      ],
    },
  ];

  return [...adminFilters, ...baseFilters];
};

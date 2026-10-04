import {
  GetFilmsListQuerySchema,
  FilmType,
  type InitialDataResponse,
  type ListOption,
} from '@hobbies-collection/shared';
import { z } from 'zod';
import { generateYearsSelectOptions } from '~/shared/helpers';
import { api, queryKey } from '~/shared/services';
import type { FilterItem } from '~/shared/types';

const ALL_OPTION: ListOption<string> = {
  value: 'all',
  label: 'All',
};

const ALL_COLLECTIONS_OPTION: ListOption<number> = {
  value: -1,
  label: 'All Collections',
};

export const FiltersSchema = z.object({
  ...GetFilmsListQuerySchema.shape,
  type: z.enum({ ...FilmType, all: 'all' }),
});

type FilterValues = z.infer<typeof FiltersSchema>;

export const filterDefaultValues: FilterValues = {
  genreIds: [],
  countryIds: [],
  studioIds: [],
  type: 'all',
  collectionId: -1,
};

export const getFiltersConfig = (
  initialData: InitialDataResponse,
): Array<FilterItem<FilterValues>> => {
  return [
    {
      title: 'Type',
      id: 'type',
      type: 'checkmark',
      options: [ALL_OPTION, ...initialData.options.types],
      inputType: 'radio',
    },
    {
      title: 'Seasons total',
      id: 'seasonsTotal',
      type: 'number',
      dependsOn: {
        filter: 'type',
        value: FilmType.SERIES,
      },
    },
    {
      title: 'Episodes total',
      id: 'episodesTotal',
      type: 'number',
      dependsOn: {
        filter: 'type',
        value: FilmType.SERIES,
      },
    },
    {
      title: 'Genres',
      id: 'genreIds',
      type: 'checkmark',
      inputType: 'checkbox',
      options: initialData.options.genres,
    },
    {
      title: 'Rating',
      id: 'rating',
      type: 'rating',
      size: 3,
    },
    {
      title: 'Year',
      id: 'year',
      type: 'select',
      options: generateYearsSelectOptions(),
    },
    {
      id: 'startDate',
      title: 'Date Range',
      inputs: {
        start: {
          label: 'Start Date',
          id: 'startDate',
        },
        end: {
          label: 'End Date',
          id: 'endDate',
        },
      },
      type: 'daterange',
    },
    {
      title: 'Country',
      id: 'countryIds',
      type: 'checkmark',
      inputType: 'checkbox',
      options: initialData.options.countries,
    },
    {
      title: 'Studio',
      id: 'studioIds',
      type: 'checkmark',
      inputType: 'checkbox',
      options: initialData.options.studios,
    },
    {
      title: 'Collections',
      id: 'collectionId',
      type: 'checkmark',
      inputType: 'radio',
      options: [ALL_COLLECTIONS_OPTION, ...initialData.options.collections],
    },
    {
      title: 'People by role',
      id: 'personId',
      type: 'combo-select',
      dependency: {
        id: 'personRole',
        label: 'Role',
        options: initialData.options.roles,
      },
      selector: {
        id: 'personId',
        isMultiple: false,
        loader: api.people.search,
        queryKey: queryKey('people.search')[0],
        label: 'Person',
      },
    },
    {
      id: 'runtimeRange',
      type: 'range',
      title: 'Runtime, min',
      min: 0,
      max: 300,
      step: 10,
    },
    {
      id: 'awardId',
      type: 'select',
      title: 'Award',
      options: initialData.options.awards,
    },
  ];
};

import type { ListOption } from '@hobbies-collection/shared';
import type { AsyncSelectProps } from '~/shared/components/async-select/async-select';

type OnlyStringKey<T> = Extract<keyof T, string>;

type BaseFilter<T extends Record<string, any>> = {
  id: OnlyStringKey<T>;
  title: string;
  dependsOn?: {
    filter: keyof T;
    value: any;
  };
};

export type CheckboxFilter<T extends Record<string, any>> = BaseFilter<T> & {
  type: 'checkmark';
  options: ListOption<string | number>[];
  inputType: 'checkbox' | 'radio';
};

export type DateFilterInput<T extends Record<string, any>> = {
  id: OnlyStringKey<T>;
  label: string;
};

export type DateFilter<T extends Record<string, any>> = BaseFilter<T> & {
  type: 'daterange';
  inputs: {
    start: DateFilterInput<T>;
    end: DateFilterInput<T>;
  };
};

export type NestedFiltersOption<T extends Record<string, any>> = {
  id: OnlyStringKey<T>;
  label: string;
};

export type NestedFilters<T extends Record<string, any>> = BaseFilter<T> & {
  type: 'boolean';
  options: NestedFiltersOption<T>[];
};

export type SelectFilter<T extends Record<string, any>> = BaseFilter<T> & {
  type: 'select';
  options: ListOption[];
};

export type AsyncSelectFilter<T extends Record<string, any>> = BaseFilter<T> & {
  type: 'search';
  loader: AsyncSelectProps<ListOption>['optionsLoader'];
  queryKey: string;
  isMultiple?: boolean;
  selected?: number[];
};

export type AsyncComboSelectFilter<T extends Record<string, any>> = BaseFilter<T> & {
  type: 'combo-select';
  dependency: {
    id: OnlyStringKey<T>;
    label: string;
    options: ListOption<any>[];
  };
  selector: {
    id: OnlyStringKey<T>;
    label: string;
    loader: AsyncSelectProps<ListOption>['optionsLoader'];
    queryKey: string;
    isMultiple?: boolean;
  };
};

export type NumberFilter<T extends Record<string, any>> = BaseFilter<T> & {
  type: 'number';
  min?: number;
  max?: number;
};

export type RatingFilter<T extends Record<string, any>> = BaseFilter<T> & {
  type: 'rating';
  size: number;
};

export type RangeFilter<T extends Record<string, any>> = BaseFilter<T> & {
  type: 'range';
  min: number;
  max: number;
  step: number;
};

export type FilterItem<T extends Record<string, any>> =
  | CheckboxFilter<T>
  | NumberFilter<T>
  | SelectFilter<T>
  | RangeFilter<T>
  | DateFilter<T>
  | RatingFilter<T>
  | NestedFilters<T>
  | AsyncComboSelectFilter<T>
  | AsyncSelectFilter<T>;

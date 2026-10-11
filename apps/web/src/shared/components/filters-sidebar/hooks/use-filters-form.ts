import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm, type DefaultValues } from 'react-hook-form';
import type z from 'zod';
import { useDebouncedSearch } from '~/shared/hooks';
import type { FilterItem } from '~/shared/types';

type Options<TDefaultValues extends Record<string, unknown>, TSchema extends z.ZodType> = {
  defaultValues: DefaultValues<TDefaultValues>;
  resetValues: TDefaultValues;
  config: FilterItem<TDefaultValues>[];
  schema: TSchema;
  onSubmit: (data: TDefaultValues) => void;
  onReset?: () => void;
};

const filterSearchIndex: Record<string, any[]> = {};

export const useFiltersForm = <
  TDefaultValues extends Record<string, unknown>,
  TSchema extends z.ZodType,
>({
  defaultValues,
  config,
  schema,
  resetValues,
  onReset,
  onSubmit,
}: Options<TDefaultValues, TSchema>) => {
  const [filteredConfig, setFilteredConfig] = useState<FilterItem<TDefaultValues>[]>(config);

  const filtersForm = useForm<TDefaultValues>({
    defaultValues,
    resolver: zodResolver(schema as any),
  });

  const resetForm = () => {
    filtersForm.reset(resetValues);
    onReset?.();
    window.scrollTo(0, 0);
  };

  const handleSubmit = (data: TDefaultValues) => {
    onSubmit(data);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    filtersForm.reset(defaultValues);
  }, [defaultValues]);

  const values = filtersForm.watch();

  const searchFilter = useDebouncedSearch((value) => {
    if (!value.length) {
      setFilteredConfig(config);
      return;
    }

    if (filterSearchIndex[value]) {
      setFilteredConfig(filterSearchIndex[value]);
      return;
    }

    const mappedConfig = config.map((item) => {
      if (item.title.toLowerCase().includes(value)) {
        return item;
      }

      if (item.type === 'checkmark' || item.type === 'select' || item.type === 'boolean') {
        const filteredOptions = item.options.filter((option) =>
          option.label.toLowerCase().includes(value),
        );

        if (!filteredOptions.length) {
          return null;
        }

        return {
          ...item,
          options: filteredOptions,
        };
      }

      return null;
    });

    const filteredConfig = mappedConfig.filter(
      (item) => item !== null,
    ) as unknown as FilterItem<TDefaultValues>[];

    setFilteredConfig(filteredConfig);
    filterSearchIndex[value] = filteredConfig;
  });

  useEffect(() => {
    setFilteredConfig(config);
  }, [config]);

  return {
    filteredConfig,
    values,
    filtersForm,
    resetForm,
    handleSubmit,
    searchFilter,
  };
};

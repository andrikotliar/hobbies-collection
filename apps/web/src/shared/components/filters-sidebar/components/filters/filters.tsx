import type z from 'zod';
import styles from './filters.module.css';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider, type DefaultValues } from 'react-hook-form';
import { RefreshCcwIcon, SearchIcon } from 'lucide-react';
import { type FilterItem, Button, TextInput, useDebouncedSearch } from '~/shared';
import { FilterOptions } from './components';
import { useEffect, useState } from 'react';

export type FiltersProps<
  TDefaultValues extends Record<string, unknown>,
  TSchema extends z.ZodType,
> = {
  config: FilterItem<TDefaultValues>[];
  defaultValues: DefaultValues<TDefaultValues>;
  resetValues: TDefaultValues;
  filtersCount: number;
  onSubmit: (data: TDefaultValues) => void;
  onReset?: () => void;
  schema: TSchema;
};

const filterSearchIndex: Record<string, any[]> = {};

export const Filters = <TDefaultValues extends Record<string, unknown>, TSchema extends z.ZodType>({
  config,
  defaultValues,
  onSubmit,
  onReset,
  filtersCount,
  schema,
  resetValues,
}: FiltersProps<TDefaultValues, TSchema>) => {
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

  return (
    <FormProvider {...filtersForm}>
      <div className={styles.search_wrapper}>
        <TextInput
          onChange={searchFilter}
          icon={<SearchIcon />}
          placeholder="Search filter or group"
        />
      </div>
      <form onSubmit={filtersForm.handleSubmit(handleSubmit)} className={styles.filters}>
        <div className={styles.filter_groups}>
          {filteredConfig.length === 0 && <div>No config values found</div>}

          {filteredConfig.map((filter) => {
            if (filter.dependsOn && values[filter.dependsOn.filter] !== filter.dependsOn.value) {
              return null;
            }

            return <FilterOptions filter={filter} key={filter.title} />;
          })}
        </div>
        <div className={styles.controls}>
          <Button icon={<SearchIcon />} type="submit">
            Search
          </Button>
          {filtersCount > 0 && (
            <Button onClick={resetForm} icon={<RefreshCcwIcon />} variant="secondary">
              Reset
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
};

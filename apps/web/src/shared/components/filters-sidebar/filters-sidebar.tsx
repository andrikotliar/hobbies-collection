import styles from './filters-sidebar.module.css';
import clsx from 'clsx';
import type z from 'zod';
import { Loader } from '~/shared/components/loader/loader';
import { defineCssProperties } from '~/shared/helpers';
import { RefreshCcwIcon, SearchIcon, XIcon } from 'lucide-react';
import { BLOCKING_SCROLL_CLASS_NAME } from '~/shared/constants';
import { FilterOptions } from './components';
import type { FilterItem } from '~/shared/types';
import { FormProvider, type DefaultValues } from 'react-hook-form';
import { TextInput } from '~/shared/components/text-input/text-input';
import { Button } from '~/shared/components/button/button';
import { useFiltersForm } from '~/shared/components/filters-sidebar/hooks';

type SidebarProps<TDefaultValues extends Record<string, unknown>, TSchema extends z.ZodType> = {
  isOpen: boolean;
  onToggle: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading?: boolean;
  heightReducer?: `${string}px`;
  topPositionMargin?: `${string}px`;
  config: FilterItem<TDefaultValues>[];
  defaultValues: DefaultValues<TDefaultValues>;
  resetValues: TDefaultValues;
  filtersCount: number;
  onSubmit: (data: TDefaultValues) => void;
  onReset?: () => void;
  schema: TSchema;
};

export const FiltersSidebar = <
  TDefaultValues extends Record<string, unknown>,
  TSchema extends z.ZodType,
>({
  isOpen,
  onToggle,
  isLoading = false,
  heightReducer = '0px',
  topPositionMargin = '0px',
  config,
  defaultValues,
  onSubmit,
  onReset,
  filtersCount,
  schema,
  resetValues,
}: SidebarProps<TDefaultValues, TSchema>) => {
  const { filtersForm, filteredConfig, values, searchFilter, handleSubmit, resetForm } =
    useFiltersForm({ config, defaultValues, onSubmit, onReset, schema, resetValues });

  if (isLoading) {
    return (
      <div className={styles.sidebar_content}>
        <Loader />
      </div>
    );
  }

  return (
    <div
      className={clsx(styles.sidebar_content, {
        [styles.open]: isOpen,
        [BLOCKING_SCROLL_CLASS_NAME]: isOpen,
      })}
      style={defineCssProperties({
        '--sidebar-height-reducer': heightReducer,
        '--sidebar-top-position-margin': topPositionMargin,
      })}
    >
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
      <button onClick={() => onToggle((isOpen) => !isOpen)} className={styles.close_icon_wrapper}>
        <XIcon />
      </button>
    </div>
  );
};

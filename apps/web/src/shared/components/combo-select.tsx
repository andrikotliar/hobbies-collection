import { useFormContext } from 'react-hook-form';
import { AppForm } from '~/shared/components/app-form';
import type { AsyncComboSelectFilter } from '~/shared/types/filter';

type ComboSelectProps<T extends Record<string, any>> = {
  filter: AsyncComboSelectFilter<T>;
};

export const ComboSelect = <T extends Record<string, any>>({ filter }: ComboSelectProps<T>) => {
  const { watch } = useFormContext();

  const selectedValue = watch(filter.dependency.id);

  return (
    <AppForm.Group title={filter.title}>
      <AppForm.Select
        name={filter.dependency.id}
        options={filter.dependency.options}
        label={filter.dependency.label}
      />
      {selectedValue && (
        <AppForm.AsyncSelect
          name={filter.selector.id}
          optionsLoader={filter.selector.loader}
          queryKeyParams={{ key: filter.selector.queryKey }}
          label={filter.selector.label}
          isMulti={filter.selector.isMultiple}
        />
      )}
    </AppForm.Group>
  );
};

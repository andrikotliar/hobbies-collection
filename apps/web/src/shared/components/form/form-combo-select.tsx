import { useFormContext } from 'react-hook-form';
import { FormAsyncSelect } from '~/shared/components/form/form-async-select';
import { FormGroup } from '~/shared/components/form/form-group';
import { FormSelect } from '~/shared/components/form/form-select';
import type { AsyncComboSelectFilter } from '~/shared/types/filter';

type Props<T extends Record<string, any>> = {
  filter: AsyncComboSelectFilter<T>;
};

export const FormComboSelect = <T extends Record<string, any>>({ filter }: Props<T>) => {
  const { watch } = useFormContext();

  const selectedValue = watch(filter.dependency.id);

  return (
    <FormGroup title={filter.title}>
      <FormSelect
        name={filter.dependency.id}
        options={filter.dependency.options}
        label={filter.dependency.label}
      />
      {selectedValue && (
        <FormAsyncSelect
          name={filter.selector.id}
          optionsLoader={filter.selector.loader}
          queryKeyParams={{ key: filter.selector.queryKey }}
          label={filter.selector.label}
          isMulti={filter.selector.isMultiple}
        />
      )}
    </FormGroup>
  );
};

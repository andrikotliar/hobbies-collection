import { useFormContext } from 'react-hook-form';
import { Form } from '~/shared/components/form/form';

import type { AsyncComboSelectFilter } from '~/shared/types';

type ComboSelectProps<T extends Record<string, any>> = {
  filter: AsyncComboSelectFilter<T>;
};

export const ComboSelect = <T extends Record<string, any>>({ filter }: ComboSelectProps<T>) => {
  const { watch } = useFormContext();

  const selectedValue = watch(filter.dependency.id);

  return (
    <Form.Group title={filter.title}>
      <Form.Select
        name={filter.dependency.id}
        options={filter.dependency.options}
        label={filter.dependency.label}
      />
      {selectedValue && (
        <Form.AsyncSelect
          name={filter.selector.id}
          optionsLoader={filter.selector.loader}
          queryKeyParams={{ key: filter.selector.queryKey }}
          label={filter.selector.label}
          isMulti={filter.selector.isMultiple}
        />
      )}
    </Form.Group>
  );
};

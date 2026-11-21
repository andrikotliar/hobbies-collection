import type { ListOption } from '@hobbies-collection/shared';
import type { FormError } from '~/shared/types/form-error';
import { Controller, useFormContext } from 'react-hook-form';
import { AsyncSelect } from '~/shared/components/async-select';
import type { FormFieldProps } from '~/shared/types/form-field-props';

export const FormAsyncSelect = <T extends ListOption<any>>({
  name,
  error: errorProp,
  ...props
}: Omit<FormFieldProps<typeof AsyncSelect<T>>, 'onSelect' | 'initialValue'>) => {
  const { control, formState } = useFormContext();

  const error = errorProp ?? formState.errors[name]?.message;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <AsyncSelect value={value} onSelect={onChange} error={error as FormError} {...props} />
      )}
    />
  );
};

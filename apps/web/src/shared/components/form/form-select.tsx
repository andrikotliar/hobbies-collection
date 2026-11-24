import type { FormError } from '~/shared/types/form-error';
import { Controller, useFormContext } from 'react-hook-form';
import { Select } from '~/shared/components/controls/select';
import type { FormFieldProps } from '~/shared/types/form-field-props';

export const FormSelect = ({
  name,
  error: errorProp,
  ...props
}: Omit<FormFieldProps<typeof Select>, 'onSelect' | 'initialValue'>) => {
  const { control, formState } = useFormContext();

  const { errors } = formState;

  const error = errorProp ?? errors[name]?.message;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <Select onSelect={onChange} value={value} error={error as FormError} {...props} />
      )}
    />
  );
};

import { Controller, useFormContext } from 'react-hook-form';
import { Toggle } from '~/shared/components/toggle/toggle';
import type { FormFieldProps } from '~/shared/types/form-field-props';

export const FormToggle = ({
  name,
  ...props
}: Omit<FormFieldProps<typeof Toggle>, 'onToggle' | 'value'>) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <Toggle value={value} onToggle={onChange} {...props} />
      )}
    />
  );
};

import { Controller, useFormContext } from 'react-hook-form';
import { RangeInput } from '~/shared/components/controls/range-input';
import type { FormFieldProps } from '~/shared/types/form-field-props';

export const FormRangeInput = ({
  name,
  ...props
}: Omit<FormFieldProps<typeof RangeInput>, 'onChange' | 'value'>) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <RangeInput onChange={onChange} value={value} {...props} />
      )}
    />
  );
};

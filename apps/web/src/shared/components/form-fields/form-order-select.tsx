import { Controller, useFormContext } from 'react-hook-form';
import { OrderSelect } from '~/shared/components/order-select/order-select';
import type { FormFieldProps } from '~/shared/types/form-field-props';

export const FormOrderSelect = ({
  name,
  ...props
}: Omit<FormFieldProps<typeof OrderSelect>, 'onChange' | 'value'>) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <OrderSelect value={value} onChange={onChange} {...props} />
      )}
    />
  );
};

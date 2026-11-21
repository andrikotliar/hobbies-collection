import { Controller, useFormContext } from 'react-hook-form';
import { MonthDateSelector } from '~/shared/components/month-date-selector/month-date-selector';
import type { FormFieldProps } from '~/shared/types/form-field-props';

export const FormMonthDateSelector = ({
  name,
  ...props
}: Omit<FormFieldProps<typeof MonthDateSelector>, 'onChange' | 'value'>) => {
  const { control, formState } = useFormContext();

  const { errors } = formState;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <MonthDateSelector
          value={value}
          onChange={onChange}
          error={errors[name]?.message as string}
          {...props}
        />
      )}
    />
  );
};

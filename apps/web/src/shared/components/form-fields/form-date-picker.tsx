import { useFormContext } from 'react-hook-form';
import { DatePicker } from '~/shared/components/date-picker';
import type { FormFieldProps } from '~/shared/types/form-field-props';

export const FormDatePicker = ({ name, ...props }: FormFieldProps<typeof DatePicker>) => {
  const { register, formState } = useFormContext();

  const { errors } = formState;

  return <DatePicker {...register(name)} error={errors[name]?.message as string} {...props} />;
};

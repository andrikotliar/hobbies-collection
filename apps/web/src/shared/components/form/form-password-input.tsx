import { useFormContext } from 'react-hook-form';
import { PasswordInput } from '~/shared/components/controls/password-input';
import type { FormFieldProps } from '~/shared/types/form-field-props';

export const FormPasswordInput = ({ name, ...props }: FormFieldProps<typeof PasswordInput>) => {
  const { register, formState } = useFormContext();

  const { errors } = formState;

  return <PasswordInput {...register(name)} {...props} error={errors[name]?.message as string} />;
};

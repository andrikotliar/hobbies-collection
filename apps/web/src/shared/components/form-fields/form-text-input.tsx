import { useFormContext } from 'react-hook-form';
import { TextInput } from '~/shared/components/text-input/text-input';
import type { FormFieldProps } from '~/shared/types/form-field-props';

export const FormTextInput = ({ name, ...props }: FormFieldProps<typeof TextInput>) => {
  const { register, formState } = useFormContext();

  const { errors } = formState;

  return <TextInput error={errors[name]?.message as string} {...register(name)} {...props} />;
};

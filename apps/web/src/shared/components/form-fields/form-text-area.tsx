import type { FormFieldProps } from '~/shared/types/form-field-props';
import { useFormContext } from 'react-hook-form';
import { TextArea } from '~/shared/components/text-area/text-area';

export const FormTextArea = ({ name, ...props }: FormFieldProps<typeof TextArea>) => {
  const { register, formState } = useFormContext();
  const { errors } = formState;

  return (
    <TextArea error={errors[name]?.message as string | undefined} {...register(name)} {...props} />
  );
};

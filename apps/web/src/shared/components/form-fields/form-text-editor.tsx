import { Controller, useFormContext } from 'react-hook-form';
import { TextEditor } from '~/shared/components/text-editor/text-editor';
import type { FormError } from '~/shared/types/form-error';
import type { FormFieldProps } from '~/shared/types/form-field-props';

export const FormTextEditor = ({
  name,
  ref,
  ...props
}: Omit<FormFieldProps<typeof TextEditor>, 'onChange' | 'content' | 'error'>) => {
  const { formState, control } = useFormContext();

  const error = formState.errors[name]?.message as FormError;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <TextEditor ref={ref} onChange={onChange} content={value} error={error} {...props} />
      )}
    />
  );
};

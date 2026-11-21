import { Controller, useFormContext } from 'react-hook-form';
import { FileInput } from '~/shared/components/file-input';
import type { FormFieldProps } from '~/shared/types/form-field-props';

export const FormFileInput = ({
  name,
  ...props
}: Omit<FormFieldProps<typeof FileInput>, 'onChange' | 'defaultValue'>) => {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <FileInput
          defaultValue={typeof value === 'string' ? value : null}
          onChange={onChange}
          onRemove={() => onChange(null)}
          error={error?.message}
          {...props}
        />
      )}
    />
  );
};

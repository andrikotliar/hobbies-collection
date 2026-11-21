import type { FormFieldProps } from '~/shared/types/form-field-props';
import { useFormContext } from 'react-hook-form';
import { VideoInput } from '~/shared/components/video-input/video-input';

export const FormVideoInput = ({
  name,
  ...props
}: Omit<FormFieldProps<typeof VideoInput>, 'externalWatchedValue' | 'ref'>) => {
  const { register, formState, watch } = useFormContext();

  const { errors } = formState;

  const currentValue = watch(name);

  return (
    <VideoInput
      error={errors[name]?.message as string}
      externalWatchedValue={currentValue}
      {...register(name)}
      {...props}
    />
  );
};

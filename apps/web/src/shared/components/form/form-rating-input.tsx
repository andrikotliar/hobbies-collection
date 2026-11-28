import type { FormFieldProps } from '~/shared/types/form-field-props';
import { Controller, useFormContext } from 'react-hook-form';
import { RatingInput } from '~/shared/components/controls/rating-input';

export const FormRatingInput = ({
  name,
  ...props
}: Omit<FormFieldProps<typeof RatingInput>, 'onChange' | 'defaultValue'>) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <RatingInput name={name} onChange={onChange} defaultValue={Number(value)} {...props} />
      )}
    />
  );
};

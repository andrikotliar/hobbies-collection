import type { FormFieldProps } from '~/shared/types/form-field-props';
import { Controller, useFormContext } from 'react-hook-form';
import { Checkbox } from '~/shared/components/checkbox';

const getCheckedValue = (formValue: unknown, checkboxValue: unknown) => {
  if (typeof formValue === 'boolean') {
    return formValue;
  }

  if (Array.isArray(formValue)) {
    return formValue.includes(checkboxValue);
  }

  return formValue === checkboxValue;
};

export const FormCheckbox = ({ name, ...props }: FormFieldProps<typeof Checkbox>) => {
  const { control, watch } = useFormContext();
  const watchedValue = watch(name);

  const handleChange = (
    checkboxValue: any,
    formValue: string | number | any[] | boolean,
    onChange: (...event: any[]) => void,
  ) => {
    if (typeof formValue === 'boolean' && !checkboxValue) {
      onChange(!formValue);
      return;
    }

    const transformedValue =
      typeof checkboxValue === 'number' ? Number(checkboxValue) : checkboxValue;

    if (!Array.isArray(formValue)) {
      onChange(transformedValue);
      return;
    }

    if (watchedValue.includes(transformedValue)) {
      const filteredValues = watchedValue.filter((v: unknown) => v !== transformedValue);
      onChange(filteredValues);
      return;
    }

    onChange([...watchedValue, transformedValue]);
  };

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={props.type === 'checkbox' && props.value !== undefined && []}
      render={({ field: { onChange, value } }) => {
        return (
          <Checkbox
            onChange={() => handleChange(props.value, value, onChange)}
            checked={getCheckedValue(value, props.value)}
            {...props}
          />
        );
      }}
    />
  );
};

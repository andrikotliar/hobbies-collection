import type { ListOption } from '@hobbies-collection/shared';
import { useFormContext } from 'react-hook-form';
import { FormCheckbox } from './form-checkbox';
import type { CheckboxType } from '~/shared/components/controls/checkbox';
import { FieldLabel } from '~/shared/components/ui/field-label';
import { FieldError } from '~/shared/components/ui/field-error';

type Props = {
  label?: string;
  name: string;
  options: ListOption<any>[];
  type: CheckboxType;
};

export const FormCheckboxesGroup = ({ label, options, name, type }: Props) => {
  const form = useFormContext();

  const { errors } = form.formState;

  return (
    <div>
      {label && <FieldLabel>{label}</FieldLabel>}
      <div className="flex flex-wrap gap-2.5">
        {options.map((option) => (
          <FormCheckbox
            key={option.value}
            label={option.label}
            name={name}
            type={type}
            value={option.value}
          />
        ))}
      </div>
      <FieldError error={errors[name]?.message as string | undefined} />
    </div>
  );
};

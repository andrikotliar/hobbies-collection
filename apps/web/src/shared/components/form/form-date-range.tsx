import { useFormContext } from 'react-hook-form';
import { FormDatePicker } from './form-date-picker';
import { FormGroup } from './form-group';
import { MIN_DATE } from '~/shared/constants/app';
import type { DateFilter } from '~/shared/types/filter';

type FormDateRangeProps<T extends Record<string, any>> = {
  inputs: DateFilter<T>['inputs'];
  title: string;
};

export const FormDateRange = <T extends Record<string, any>>({
  inputs,
  title,
}: FormDateRangeProps<T>) => {
  const { getValues } = useFormContext();
  const formValues = getValues();

  return (
    <FormGroup title={title}>
      <FormDatePicker
        name={inputs.start.id}
        min={MIN_DATE}
        max={formValues[inputs.end.id] ?? undefined}
        label={inputs.start.label}
      />
      <FormDatePicker
        name={inputs.end.id}
        min={formValues[inputs.start.id] ?? MIN_DATE}
        label={inputs.end.label}
      />
    </FormGroup>
  );
};

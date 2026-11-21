import clsx from 'clsx';
import { RotateCwIcon, SaveIcon } from 'lucide-react';
import { useEffect } from 'react';
import { FormProvider, useForm, type DefaultValues } from 'react-hook-form';
import type z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '~/shared/components/button';
import { FormTitle } from './form-fields/form-title';
import { FormArrayFieldWrapper } from './form-fields/form-array-field-wrapper';
import { FormArrayWrapper } from './form-fields/form-array-wrapper';
import { FormAsyncSelect } from './form-fields/form-async-select';
import { FormCheckbox } from './form-fields/form-checkbox';
import { FormCheckboxesGroup } from './form-fields/form-checkboxes-group';
import { FormDatePicker } from './form-fields/form-date-picker';
import { FormDateRange } from './form-fields/form-date-range';
import { FormFileInput } from './form-fields/form-file-input';
import { FormGroup } from './form-fields/form-group';
import { FormMonthDateSelector } from './form-fields/form-month-date-selector';
import { FormRatingInput } from './form-fields/form-rating-input';
import { FormSection } from './form-fields/form-section';
import { FormSelect } from './form-fields/form-select';
import { FormTextArea } from './form-fields/form-text-area';
import { FormTextEditor } from './form-fields/form-text-editor';
import { FormTextInput } from './form-fields/form-text-input';
import { FormToggle } from './form-fields/form-toggle';
import { FormVideoInput } from './form-fields/form-video-input';
import { FormOrderSelect } from './form-fields/form-order-select';
import { FormPasswordInput } from './form-fields/form-password-input';
import { FormRangeInput } from './form-fields/form-range-input';

type FormResetHandler<TDefaultValues extends Record<PropertyKey, unknown>> = (
  values: TDefaultValues,
) => void;

type FormProps<TDefaultValues extends Record<PropertyKey, unknown>, TSchema extends z.ZodType> = {
  onSubmit: (data: TDefaultValues) => Promise<unknown> | unknown;
  defaultValues?: DefaultValues<TDefaultValues>;
  schema: TSchema;
  isLoading?: boolean;
  submitButtonText?: string;
  title?: string;
  submitIcon?: React.ReactNode;
  children?: React.ReactNode;
  onReset?: (formReset: FormResetHandler<TDefaultValues>) => void;
  islandActions?: boolean;
};

export const AppForm = <
  TDefaultValues extends Record<PropertyKey, unknown>,
  TSchema extends z.ZodType<unknown>,
>({
  children,
  onSubmit,
  defaultValues,
  schema,
  isLoading = false,
  submitButtonText = 'Save',
  title,
  submitIcon = <SaveIcon />,
  onReset,
  islandActions = false,
}: FormProps<TDefaultValues, TSchema>) => {
  const form = useForm<TDefaultValues>({
    resolver: zodResolver(schema as any),
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues]);

  return (
    <FormProvider {...form}>
      <form className="flex flex-col gap-5 w-full" onSubmit={form.handleSubmit(onSubmit)}>
        {title && <FormTitle>{title}</FormTitle>}
        {children}
        <div
          className={clsx(
            'flex flex-wrap gap-5',
            'w-full sticky bottom-0 z-10',
            '[&>button]:grow',
            islandActions && 'bottom-15 md:bottom-0 p-5 bg-white rounded-lg',
          )}
        >
          {onReset && (
            <Button variant="secondary" onClick={() => onReset(form.reset)} icon={<RotateCwIcon />}>
              Reset
            </Button>
          )}
          <Button type="submit" isDisabled={isLoading} isLoading={isLoading} icon={submitIcon}>
            {submitButtonText}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

AppForm.ArrayFieldWrapper = FormArrayFieldWrapper;
AppForm.ArrayWrapper = FormArrayWrapper;
AppForm.AsyncSelect = FormAsyncSelect;
AppForm.Checkbox = FormCheckbox;
AppForm.CheckboxesGroup = FormCheckboxesGroup;
AppForm.DatePicker = FormDatePicker;
AppForm.DateRange = FormDateRange;
AppForm.FileInput = FormFileInput;
AppForm.Group = FormGroup;
AppForm.MonthDateSelector = FormMonthDateSelector;
AppForm.RatingInput = FormRatingInput;
AppForm.Section = FormSection;
AppForm.Select = FormSelect;
AppForm.TextArea = FormTextArea;
AppForm.TextEditor = FormTextEditor;
AppForm.TextInput = FormTextInput;
AppForm.Title = FormTitle;
AppForm.Toggle = FormToggle;
AppForm.VideoInput = FormVideoInput;
AppForm.OrderSelect = FormOrderSelect;
AppForm.PasswordInput = FormPasswordInput;
AppForm.RangeInput = FormRangeInput;

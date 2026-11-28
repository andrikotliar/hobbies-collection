import { useFormContext } from 'react-hook-form';
import type z from 'zod';
import { FieldLabel } from '~/shared/components/ui/field-label';
import { AppForm } from '~/shared/components/form/app-form';
import type { CollectionEventFormSchema } from '~/shared/schemas/collection-event-form.schema';
import clsx from 'clsx';

const columnClassNames = clsx('flex flex-col gap-3');
const dateFieldClassNames = clsx('flex justify-between items-center gap-3 h-6');

export const Dates = () => {
  const { watch } = useFormContext<z.infer<typeof CollectionEventFormSchema>>();

  const isOneDayEvent = watch('isOneDayEvent');

  return (
    <div className="flex flex-wrap items-center gap-7">
      <div className={columnClassNames}>
        <div className={dateFieldClassNames}>
          <FieldLabel>Start Date</FieldLabel>
          <AppForm.Checkbox name="isOneDayEvent" type="checkbox" label="One day event" />
        </div>
        <AppForm.MonthDateSelector name="startDateCode" />
      </div>
      {!isOneDayEvent && (
        <div className={columnClassNames}>
          <div className={dateFieldClassNames}>
            <FieldLabel>End Date</FieldLabel>
          </div>
          <AppForm.MonthDateSelector name="endDateCode" />
        </div>
      )}
    </div>
  );
};

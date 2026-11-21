import styles from './styles.module.css';
import { useFormContext } from 'react-hook-form';
import type z from 'zod';
import { FieldLabel } from '~/shared/components/field-label/field-label';
import { AppForm } from '~/shared/components/app-form';
import type { CollectionEventFormSchema } from '~/shared/schemas/collection-event-form.schema';

export const Dates = () => {
  const { watch } = useFormContext<z.infer<typeof CollectionEventFormSchema>>();

  const isOneDayEvent = watch('isOneDayEvent');

  return (
    <div className={styles.dates}>
      <div className={styles.column}>
        <div className={styles.date_field}>
          <FieldLabel>Start Date</FieldLabel>
          <AppForm.Checkbox name="isOneDayEvent" type="checkbox" label="One day event" />
        </div>
        <AppForm.MonthDateSelector name="startDateCode" />
      </div>
      {!isOneDayEvent && (
        <div className={styles.column}>
          <div className={styles.date_field}>
            <FieldLabel>End Date</FieldLabel>
          </div>
          <AppForm.MonthDateSelector name="endDateCode" />
        </div>
      )}
    </div>
  );
};

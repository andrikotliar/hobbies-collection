import { useFieldArray, useFormContext } from 'react-hook-form';
import type { ListOption } from '@hobbies-collection/shared';
import type z from 'zod';
import type { FilmFormSchema } from '~/shared/schemas/film-form.schema';
import { AppForm } from '~/shared/components/form/app-form';
import { NominationSelect } from './components/nomination-select/nomination-select';

type Props = {
  awardOptions: ListOption<number>[];
};

const defaultAward: z.infer<typeof FilmFormSchema>['awards'][number] = {
  awardId: 0,
  nominations: [],
};

export const AwardsSelect = ({ awardOptions }: Props) => {
  const { control, formState } = useFormContext<z.infer<typeof FilmFormSchema>>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'awards',
  });

  return (
    <AppForm.Section label="Awards">
      <AppForm.ArrayWrapper onCreate={() => append(defaultAward)} createButtonLabel="Add award">
        {fields.map((field, index) => (
          <AppForm.ArrayFieldWrapper onRemove={() => remove(index)} key={field.id}>
            <AppForm.Select
              name={`awards.${index}.awardId`}
              options={awardOptions}
              label="Award"
              error={formState.errors?.awards?.[index]?.awardId?.message}
            />
            <NominationSelect index={index} />
          </AppForm.ArrayFieldWrapper>
        ))}
      </AppForm.ArrayWrapper>
    </AppForm.Section>
  );
};

import { useFormContext } from 'react-hook-form';
import type z from 'zod';
import { AppForm } from '~/shared/components/form/app-form';
import type { FilmFormSchema } from '~/shared/schemas/film-form.schema';

export const SeriesExtension = () => {
  const { watch } = useFormContext<z.infer<typeof FilmFormSchema>>();

  const titleType = watch('type');

  if (!titleType?.includes('SERIES')) {
    return null;
  }

  return (
    <>
      <AppForm.TextInput type="number" name="seriesExtension.seasonsTotal" label="Seasons total" />
      <AppForm.TextInput
        type="number"
        name="seriesExtension.episodesTotal"
        label="Episodes total"
      />
    </>
  );
};

import { useQuery } from '@tanstack/react-query';
import { useFormContext } from 'react-hook-form';
import type z from 'zod';
import { AppForm } from '~/shared/components/form/app-form';
import { isNewItem } from '~/shared/helpers/is-new-item';
import { buildGetFilmChaptersQueryOptions } from '~/shared/helpers/query-options/films.options';
import type { FilmFormSchema } from '~/shared/schemas/film-form.schema';
import { api } from '~/shared/services/api';
import type { MixedId } from '~/shared/types/mixed-id';

const getId = ({ originId, filmId }: { originId: number | null | undefined; filmId: MixedId }) => {
  if (originId) {
    return originId;
  }

  if (!isNewItem(filmId)) {
    return filmId;
  }

  return null;
};

export const FilmChapterSelect = () => {
  const { watch } = useFormContext<z.infer<typeof FilmFormSchema>>();

  const originFilmId = watch('originFilmId');
  const filmId = watch('id');

  const id = getId({ originId: originFilmId, filmId });

  const { data = [], isLoading } = useQuery(buildGetFilmChaptersQueryOptions(id));

  return (
    <AppForm.Section label="Chapter sequence">
      <div className="flex flex-col gap-2">
        <AppForm.AsyncSelect
          optionsLoader={api.films.getOptions}
          queryKeyParams={{ key: 'filmFormOriginFilmId', values: [id] }}
          name="originFilmId"
          label="Origin film"
          isOptionsLoading={isLoading}
        />
        {data.length > 1 && (
          <AppForm.OrderSelect name="sequenceNumber" list={data} currentId={filmId} />
        )}
      </div>
    </AppForm.Section>
  );
};

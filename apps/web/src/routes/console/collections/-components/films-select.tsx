import { useFieldArray, useFormContext } from 'react-hook-form';
import type z from 'zod';
import { AsyncSelect } from '~/shared/components/controls/async-select';
import { TrashIcon } from 'lucide-react';
import { api } from '~/shared/services/api';
import { toaster } from '~/shared/utils/toaster';
import { AppForm } from '~/shared/components/form/app-form';
import type { CollectionFormSchema } from '~/shared/schemas/collection-form.schema';
import clsx from 'clsx';

const wrapperClassNames = clsx('flex flex-col gap-2.5');

export const FilmsSelect = () => {
  const { control } = useFormContext<z.infer<typeof CollectionFormSchema>>();

  const { fields, remove, prepend } = useFieldArray({ control, name: 'films' });

  return (
    <div className={wrapperClassNames}>
      <div className="sticky -top-5 bg-white py-1">
        <AsyncSelect
          optionsLoader={api.films.getOptions}
          queryKeyParams={{ key: 'collectionFormFilmId' }}
          onSelect={(value: number, option) => {
            if (fields.find((film) => film.filmId === value)) {
              toaster.warning(`${option?.label} is already added`);
              return;
            }
            prepend({
              filmId: value,
              title: option?.label ?? '',
            });
          }}
          label="Add film"
        />
      </div>
      <AppForm.Section label="Films">
        <div className={wrapperClassNames}>
          {fields.map((film, index) => (
            <div className="flex items-center bg-white p-2.5 border border-slate-400" key={film.id}>
              <div>{film.title}</div>
              <button className="ml-auto" onClick={() => remove(index)} type="button">
                <TrashIcon size={18} />
              </button>
            </div>
          ))}
        </div>
        {fields.length === 0 && <div>No selected films</div>}
      </AppForm.Section>
    </div>
  );
};

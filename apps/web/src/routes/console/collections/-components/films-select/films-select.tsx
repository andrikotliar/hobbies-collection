import { useFieldArray, useFormContext } from 'react-hook-form';
import type z from 'zod';
import { AsyncSelect } from '~/shared/components/async-select';
import styles from './styles.module.css';
import { TrashIcon } from 'lucide-react';
import { api } from '~/shared/services/api';
import { toaster } from '~/shared/utils/toaster';
import { AppForm } from '~/shared/components/app-form';
import type { CollectionFormSchema } from '~/shared/schemas/collection-form.schema';

export const FilmsSelect = () => {
  const { control } = useFormContext<z.infer<typeof CollectionFormSchema>>();

  const { fields, remove, prepend } = useFieldArray({ control, name: 'films' });

  return (
    <div className={styles.wrapper}>
      <div className={styles.select_wrapper}>
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
        <div className={styles.wrapper}>
          {fields.map((film, index) => (
            <div className={styles.item} key={film.id}>
              <div>{film.title}</div>
              <button className={styles.delete_button} onClick={() => remove(index)} type="button">
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

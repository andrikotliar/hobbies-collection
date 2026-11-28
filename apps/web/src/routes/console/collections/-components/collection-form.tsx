import type z from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { FilmsSelect } from '~/routes/console/collections/-components/films-select';
import type { FormComponentProps } from '~/shared/types/form-component-props';
import { useFormModal } from '~/shared/context/form-modal-context';
import { getFilmsByCollectionQueryOptions } from '~/shared/helpers/query-options/films/get-films-by-collection-query-options';
import { mutateEntity } from '~/shared/helpers/mutate-entity';
import { api, queryKey } from '~/shared/services/api';
import { AppForm } from '~/shared/components/form/app-form';
import { getFormTitle } from '~/shared/helpers/get-form-title';
import { CollectionFormSchema } from '~/shared/schemas/collection-form.schema';

type Props = FormComponentProps<z.infer<typeof CollectionFormSchema>>;

export const CollectionForm = ({ values }: Props) => {
  const { onClose } = useFormModal();
  const { data: films = [] } = useQuery(getFilmsByCollectionQueryOptions(values.id));

  const { mutateAsync, isPending } = useMutation({
    mutationFn: mutateEntity(api.collections.create, api.collections.update),
    meta: {
      invalidateQueries: [
        { queryKey: queryKey('collections.getList') },
        { queryKey: queryKey('initialData.get') },
        { queryKey: queryKey('films.getByCollection') },
      ],
    },
  });

  const submit = async (data: z.infer<typeof CollectionFormSchema>) => {
    const orderedFilms = data.films.map((film, index) => ({
      ...film,
      order: index + 1,
    }));

    await mutateAsync({ ...data, films: orderedFilms });
    onClose();
  };

  return (
    <AppForm
      onSubmit={submit}
      defaultValues={{ ...values, films: films.map((film) => ({ ...film, filmId: film.id })) }}
      title={getFormTitle(values, 'Collection')}
      schema={CollectionFormSchema}
      isLoading={isPending}
    >
      <AppForm.TextInput type="text" name="title" label="Title" />
      <AppForm.TextArea label="Description" name="description" />
      <FilmsSelect />
    </AppForm>
  );
};

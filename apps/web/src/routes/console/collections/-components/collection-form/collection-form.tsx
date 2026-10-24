import type z from 'zod';
import {
  type FormComponentProps,
  Form,
  api,
  buildGetFilmsByCollectionQueryOptions,
  mutateEntity,
  queryKey,
} from '~/shared';
import { getFormTitle } from '~/routes/console/-shared/helpers';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CollectionFormSchema } from '~/routes/console/collections/-schemas';
import { useFormModal } from '~/routes/console/-shared';
import { FilmsSelect } from '~/routes/console/collections/-components/films-select/films-select';

type CollectionFormProps = FormComponentProps<z.infer<typeof CollectionFormSchema>>;

export const CollectionForm = ({ values }: CollectionFormProps) => {
  const { onClose } = useFormModal();
  const { data: films = [] } = useQuery(buildGetFilmsByCollectionQueryOptions(values.id));

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
    <Form
      onSubmit={submit}
      defaultValues={{ ...values, films: films.map((film) => ({ ...film, filmId: film.id })) }}
      title={getFormTitle(values, 'Collection')}
      schema={CollectionFormSchema}
      isLoading={isPending}
    >
      <Form.TextInput type="text" name="title" label="Title" />
      <Form.TextArea label="Description" name="description" />
      <FilmsSelect />
    </Form>
  );
};

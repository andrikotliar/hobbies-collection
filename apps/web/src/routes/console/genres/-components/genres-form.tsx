import { useMutation } from '@tanstack/react-query';
import type z from 'zod';
import { AppForm } from '~/shared/components/form/app-form';
import { useFormModal } from '~/shared/context/form-modal-context';
import { getFormTitle } from '~/shared/helpers/get-form-title';
import { mutateEntity } from '~/shared/helpers/mutate-entity';
import { GenreFormSchema } from '~/shared/schemas/genre-form.schema';
import { api, queryKey } from '~/shared/services/api';
import type { FormComponentProps } from '~/shared/types/form-component-props';

type Props = FormComponentProps<z.infer<typeof GenreFormSchema>>;

export const GenresForm = ({ values }: Props) => {
  const { onClose } = useFormModal();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: mutateEntity(api.genres.create, api.genres.update),
    meta: {
      invalidateQueries: [
        { queryKey: queryKey('genres.getList') },
        { queryKey: queryKey('initialData.get') },
      ],
    },
  });

  const submit = async (data: z.infer<typeof GenreFormSchema>) => {
    await mutateAsync(data);
    onClose();
  };

  return (
    <AppForm
      onSubmit={submit}
      title={getFormTitle(values, 'Genre')}
      defaultValues={values}
      schema={GenreFormSchema}
      isLoading={isPending}
    >
      <AppForm.TextInput name="title" label="Title" />
    </AppForm>
  );
};

import { useMutation } from '@tanstack/react-query';
import type z from 'zod';
import { AppForm } from '~/shared/components/form/app-form';
import { useFormModal } from '~/shared/context/form-modal-context';
import { getFormTitle } from '~/shared/helpers/get-form-title';
import { mutateEntity } from '~/shared/helpers/mutate-entity';
import { uploadImage } from '~/shared/helpers/upload-image';
import { HobbyFormSchema } from '~/shared/schemas/hobby-form.schema';
import { api, queryKey } from '~/shared/services/api';
import type { FormComponentProps } from '~/shared/types/form-component-props';

type Props = FormComponentProps<z.infer<typeof HobbyFormSchema>>;

export const HobbyForm = ({ values }: Props) => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: mutateEntity(api.hobbies.createHobby, api.hobbies.updateHobby),
    meta: {
      invalidateQueries: { queryKey: queryKey('hobbies.getHobbiesList') },
    },
  });
  const { onClose } = useFormModal();

  const submit = async (data: z.infer<typeof HobbyFormSchema>) => {
    const { title, imagePath, id } = data;

    const url = await uploadImage({ image: imagePath, title, folder: 'hobbies' });

    await mutateAsync({ title, imagePath: url, id });
    onClose();
  };

  return (
    <AppForm
      onSubmit={submit}
      defaultValues={values}
      schema={HobbyFormSchema}
      isLoading={isPending}
      title={getFormTitle(values, 'Hobby')}
    >
      <AppForm.TextInput name="title" label="Title" />
      <AppForm.FileInput name="imagePath" label="Image" width="80%" height={300} />
    </AppForm>
  );
};

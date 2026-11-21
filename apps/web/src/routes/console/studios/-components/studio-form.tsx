import { useMutation } from '@tanstack/react-query';
import type z from 'zod';
import { AppForm } from '~/shared/components/app-form';
import { useFormModal } from '~/shared/context/form-modal-context';
import { getFormTitle } from '~/shared/helpers/get-form-title';
import { mutateEntity } from '~/shared/helpers/mutate-entity';
import { StudioFormSchema } from '~/shared/schemas/studio-form.schema';
import { api, queryKey } from '~/shared/services/api';
import type { FormComponentProps } from '~/shared/types/form-component-props';

type Props = FormComponentProps<z.infer<typeof StudioFormSchema>>;

export const StudioForm = ({ values }: Props) => {
  const { onClose } = useFormModal();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: mutateEntity(api.studios.create, api.studios.update),
    meta: {
      invalidateQueries: [
        { queryKey: queryKey('studios.getList') },
        { queryKey: queryKey('initialData.get') },
      ],
    },
  });

  const submit = async (data: z.infer<typeof StudioFormSchema>) => {
    await mutateAsync(data);
    onClose();
  };

  return (
    <AppForm
      onSubmit={submit}
      isLoading={isPending}
      title={getFormTitle(values, 'Studio')}
      defaultValues={values}
      schema={StudioFormSchema}
    >
      <AppForm.TextInput name="title" label="Title" />
    </AppForm>
  );
};

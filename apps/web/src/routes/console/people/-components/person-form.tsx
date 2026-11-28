import type z from 'zod';
import { useMutation } from '@tanstack/react-query';
import type { FormComponentProps } from '~/shared/types/form-component-props';
import { PersonFormSchema } from '~/shared/schemas/person-form.schema';
import { mutateEntity } from '~/shared/helpers/mutate-entity';
import { api, queryKey } from '~/shared/services/api';
import { useFormModal } from '~/shared/context/form-modal-context';
import { AppForm } from '~/shared/components/form/app-form';
import { getFormTitle } from '~/shared/helpers/get-form-title';

export type Props = FormComponentProps<z.infer<typeof PersonFormSchema>>;

export const PersonForm = ({ values }: Props) => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: mutateEntity(api.people.create, api.people.update),
    meta: {
      invalidateQueries: { queryKey: queryKey('people.getList') },
    },
  });
  const { onClose } = useFormModal();

  const submit = async (data: z.infer<typeof PersonFormSchema>) => {
    await mutateAsync(data);
    onClose();
  };

  return (
    <AppForm
      onSubmit={submit}
      defaultValues={values}
      schema={PersonFormSchema}
      title={getFormTitle(values, 'Person', 'name')}
      isLoading={isPending}
    >
      <AppForm.TextInput name="name" label="Person name" />
      <AppForm.Checkbox name="selected" label="Selected" type="checkbox" />
    </AppForm>
  );
};

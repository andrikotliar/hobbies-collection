import type z from 'zod';
import { useMutation } from '@tanstack/react-query';
import type { FormComponentProps } from '~/shared/types/form-component-props';
import { mutateEntity } from '~/shared/helpers/mutate-entity';
import { api, queryKey } from '~/shared/services/api';
import { useFormModal } from '~/shared/context/form-modal-context';
import { AppForm } from '~/shared/components/form/app-form';
import { getFormTitle } from '~/shared/helpers/get-form-title';
import { CountryFormSchema } from '~/shared/schemas/country-form.schema';

type Props = FormComponentProps<z.infer<typeof CountryFormSchema>>;

export const CountryForm = ({ values }: Props) => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: mutateEntity(api.countries.create, api.countries.update),
    meta: {
      invalidateQueries: [
        { queryKey: queryKey('countries.getList') },
        { queryKey: queryKey('initialData.get') },
      ],
    },
  });
  const { onClose } = useFormModal();

  const submit = async (data: z.infer<typeof CountryFormSchema>) => {
    await mutateAsync(data);
    onClose();
  };

  return (
    <AppForm
      onSubmit={submit}
      defaultValues={values}
      schema={CountryFormSchema}
      isLoading={isPending}
      title={getFormTitle(values, 'Country')}
    >
      <AppForm.TextInput name="title" label="Title" />
    </AppForm>
  );
};

import type z from 'zod';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import type { FormComponentProps } from '~/shared/types/form-component-props';
import { getInitialDataQueryOptions } from '~/shared/helpers/query-options/initial-data/get-initial-data-query-options';
import { useFormModal } from '~/shared/context/form-modal-context';
import { mutateEntity } from '~/shared/helpers/mutate-entity';
import { api, queryKey } from '~/shared/services/api';
import { getFormTitle } from '~/shared/helpers/get-form-title';
import { AppForm } from '~/shared/components/app-form';
import { Dates } from '~/routes/console/collection-events/-components/dates/dates';
import { CollectionEventFormSchema } from '~/shared/schemas/collection-event-form.schema';

type Props = FormComponentProps<z.infer<typeof CollectionEventFormSchema>>;

export const CollectionEventForm = ({ values }: Props) => {
  const { data } = useSuspenseQuery(getInitialDataQueryOptions());
  const { onClose } = useFormModal();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: mutateEntity(api.collectionEvents.create, api.collectionEvents.update),
    meta: {
      invalidateQueries: [
        { queryKey: queryKey('collectionEvents.getList') },
        { queryKey: queryKey('initialData.get') },
      ],
    },
  });

  const title = getFormTitle(values, 'Collection Event');

  const submit = async (data: z.infer<typeof CollectionEventFormSchema>) => {
    await mutateAsync({
      ...data,
      endDateCode: data.isOneDayEvent ? data.startDateCode : data.endDateCode,
    });
    onClose();
  };

  return (
    <AppForm
      onSubmit={submit}
      defaultValues={values}
      title={title}
      schema={CollectionEventFormSchema}
      isLoading={isPending}
    >
      <AppForm.TextInput name="title" label="Title" />
      <AppForm.Select
        label="Collection"
        options={data?.options.collections ?? []}
        name="collectionId"
      />
      <Dates />
      <AppForm.AsyncSelect
        name="titleFilmId"
        optionsLoader={api.films.getOptions}
        label="Title film"
        queryKeyParams={{ key: 'collectionEventFilmId', values: [values.titleFilmId] }}
      />
      <AppForm.TextInput
        name="yearFrom"
        label="First event occurrence year"
        placeholder="E.g. 2020"
      />
    </AppForm>
  );
};

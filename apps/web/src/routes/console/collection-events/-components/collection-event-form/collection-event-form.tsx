import type z from 'zod';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import {
  api,
  Form,
  type FormComponentProps,
  getInitialDataQueryOptions,
  mutateEntity,
  queryKey,
} from '~/shared';
import { getFormTitle } from '~/routes/console/-shared/helpers';
import { Dates } from '~/routes/console/collection-events/-components';
import { CollectionEventFormSchema } from '~/routes/console/collection-events/-schemas';
import { useFormModal } from '~/routes/console/-shared';

type CollectionEventFormProps = FormComponentProps<z.infer<typeof CollectionEventFormSchema>>;

export const CollectionEventForm = ({ values }: CollectionEventFormProps) => {
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
    <Form
      onSubmit={submit}
      defaultValues={values}
      title={title}
      schema={CollectionEventFormSchema}
      isLoading={isPending}
    >
      <Form.TextInput name="title" label="Title" />
      <Form.Select
        label="Collection"
        options={data?.options.collections ?? []}
        name="collectionId"
      />
      <Dates />
      <Form.AsyncSelect
        name="titleFilmId"
        optionsLoader={api.films.getOptions}
        label="Title film"
        queryKeyParams={{ key: 'collectionEventFilmId', values: [values.titleFilmId] }}
      />
      <Form.TextInput name="yearFrom" label="First event occurrence year" placeholder="E.g. 2020" />
    </Form>
  );
};

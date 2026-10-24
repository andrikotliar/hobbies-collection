import { type ListOption } from '@hobbies-collection/shared';
import { useMutation } from '@tanstack/react-query';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { ItemOrderSelect, type DataParams, type ItemOrderSelectProps } from './components';
import { api, FieldError, Form, queryKey, type MixedId } from '~/shared';

type CollectionsSelectProps<T extends DataParams> = {
  options: ListOption<number>[];
  getCurrentCollection: (collectionId: MixedId) => ItemOrderSelectProps<T>['queryOptions'];
  currentItemId: MixedId;
};

type FormValueSlice = {
  collections: {
    collectionId: number;
    order: number;
  }[];
};

const defaultCollection = {
  collectionId: 0,
  order: 0,
};

export const CollectionsSelect = <T extends DataParams>({
  options,
  getCurrentCollection,
  currentItemId,
}: CollectionsSelectProps<T>) => {
  const { control, formState, watch } = useFormContext<FormValueSlice>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'collections',
  });

  const collections = watch('collections');

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (title: string): Promise<ListOption<number>> => {
      if (!title.length) {
        throw new Error('Collection title cannot be empty');
      }

      const result = await api.collections.create({
        input: {
          title,
          films: [],
        },
      });

      return {
        value: result.id,
        label: result.title,
      };
    },
    meta: {
      invalidateQueries: [
        {
          queryKey: queryKey('collections.getList'),
        },
        {
          queryKey: queryKey('collections.getAll'),
        },
        {
          queryKey: queryKey('collections.getHobbyRelated'),
        },
      ],
      skipErrorToast: true,
    },
  });

  return (
    <Form.Section label="Collections">
      <Form.ArrayWrapper
        onCreate={() => append(defaultCollection)}
        createButtonLabel="Add collection"
      >
        {fields.map((field, index) => (
          <Form.ArrayFieldWrapper onRemove={() => remove(index)} key={field.id}>
            <Form.Select
              name={`collections.${index}.collectionId`}
              options={options}
              label="Collection"
              error={formState.errors?.collections?.[index]?.collectionId?.message}
              isOptionsLoading={isPending}
              onCreateOption={mutateAsync}
            />
            {collections[index].collectionId !== 0 && (
              <ItemOrderSelect
                name={`collections.${index}.order`}
                queryOptions={getCurrentCollection(collections[index].collectionId)}
                currentItemId={currentItemId}
              />
            )}
            <FieldError error={formState.errors?.collections?.[index]?.order?.message} />
          </Form.ArrayFieldWrapper>
        ))}
      </Form.ArrayWrapper>
    </Form.Section>
  );
};

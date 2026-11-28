import { type ListOption } from '@hobbies-collection/shared';
import { useMutation } from '@tanstack/react-query';
import { useFieldArray, useFormContext } from 'react-hook-form';
import {
  FormOrderItemSelect,
  type DataParams,
  type OrderItemQueryOptions,
} from './form-order-item-select';
import type { MixedId } from '~/shared/types/mixed-id';
import { api, queryKey } from '~/shared/services/api';
import { FieldError } from '~/shared/components/ui/field-error';
import { FormSection } from '~/shared/components/form/form-section';
import { FormArrayWrapper } from '~/shared/components/form/form-array-wrapper';
import { FormArrayFieldWrapper } from '~/shared/components/form/form-array-field-wrapper';
import { FormSelect } from '~/shared/components/form/form-select';

type Props<T extends DataParams> = {
  options: ListOption<number>[];
  getCurrentCollection: (collectionId: MixedId) => OrderItemQueryOptions<T>;
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

export const FormCollectionsSelect = <T extends DataParams>({
  options,
  getCurrentCollection,
  currentItemId,
}: Props<T>) => {
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
    <FormSection label="Collections">
      <FormArrayWrapper
        onCreate={() => append(defaultCollection)}
        createButtonLabel="Add collection"
      >
        {fields.map((field, index) => (
          <FormArrayFieldWrapper onRemove={() => remove(index)} key={field.id}>
            <FormSelect
              name={`collections.${index}.collectionId`}
              options={options}
              label="Collection"
              error={formState.errors?.collections?.[index]?.collectionId?.message}
              isOptionsLoading={isPending}
              onCreateOption={mutateAsync}
            />
            {collections[index].collectionId !== 0 && (
              <FormOrderItemSelect
                name={`collections.${index}.order`}
                queryOptions={getCurrentCollection(collections[index].collectionId)}
                currentItemId={currentItemId}
              />
            )}
            <FieldError error={formState.errors?.collections?.[index]?.order?.message} />
          </FormArrayFieldWrapper>
        ))}
      </FormArrayWrapper>
    </FormSection>
  );
};

import { type ListOption } from '@hobbies-collection/shared';
import { useMutation } from '@tanstack/react-query';
import { useMatches, useParams } from '@tanstack/react-router';
import type z from 'zod';
import { AppForm } from '~/shared/components/form/app-form';
import { useFormModal } from '~/shared/context/form-modal-context';
import { getFormTitle } from '~/shared/helpers/get-form-title';
import { getObjectsDiff } from '~/shared/helpers/get-objects-diff';
import { isNewItem } from '~/shared/helpers/is-new-item';
import { titleToFileName } from '~/shared/helpers/title-to-file-name';
import { uploadImage } from '~/shared/helpers/upload-image';
import { HobbyItemFormSchema } from '~/shared/schemas/hobby-item.schema';
import { api, queryKey } from '~/shared/services/api';
import type { FormComponentProps } from '~/shared/types/form-component-props';

type Props = FormComponentProps<z.infer<typeof HobbyItemFormSchema>>;

export const HobbyItemForm = ({ values }: Props) => {
  const { id: hobbyId } = useParams({ from: '/console/hobbies_/$id' });

  const { onClose } = useFormModal();

  const matches = useMatches();

  const hobbyItemMutation = useMutation({
    mutationFn: async (input: z.infer<typeof HobbyItemFormSchema>) => {
      const { id: hobbyItemId, ...data } = input;
      const currentRoute = matches.at(-1);
      const loaderData = currentRoute?.loaderData as Record<string, any>;
      const pageTitle = loaderData.title;

      const imagePath = await uploadImage({
        image: data.imagePath,
        title: input.title,
        folder: pageTitle ? titleToFileName(String(pageTitle)) : 'hobby_items',
      });

      const finalInput = {
        ...data,
        imagePath,
      };

      if (!isNewItem(hobbyItemId)) {
        const { id: _, ...defaultValues } = values;
        const diff = getObjectsDiff(defaultValues, finalInput);

        if (!diff) {
          return;
        }

        return await api.hobbies.updateHobbyItem({
          params: {
            id: +hobbyId,
            itemId: hobbyItemId,
          },
          input: diff,
        });
      }

      return await api.hobbies.createHobbyItem({
        input: {
          ...data,
          imagePath,
        },
        params: {
          id: +hobbyId,
        },
      });
    },
    onSuccess: () => {
      onClose();
    },
    meta: {
      invalidateQueries: {
        queryKey: queryKey('hobbies.getHobbyAdmin', +hobbyId),
      },
    },
  });

  const createPersonMutation = useMutation({
    mutationFn: async (value: string): Promise<ListOption<number>> => {
      if (!value.length) {
        throw new Error('Name cannot be empty');
      }
      const result = await api.people.create({
        input: {
          name: value,
        },
      });

      return {
        value: result.id,
        label: result.name,
      };
    },
  });

  return (
    <AppForm
      onSubmit={hobbyItemMutation.mutate}
      title={getFormTitle(values, 'hobby item')}
      defaultValues={values}
      schema={HobbyItemFormSchema}
      isLoading={hobbyItemMutation.isPending}
    >
      <AppForm.TextInput name="title" label="Title" />
      <AppForm.TextInput type="number" name="releaseYear" label="Release year" />
      <AppForm.FileInput name="imagePath" label="Image" />
      <AppForm.AsyncSelect
        label="Authors"
        isMulti
        name="people"
        optionsLoader={api.people.search}
        queryKeyParams={{ key: queryKey('people.search')[0], values: values.people }}
        onCreateOption={createPersonMutation.mutateAsync}
        isOptionsLoading={createPersonMutation.isPending}
      />
    </AppForm>
  );
};

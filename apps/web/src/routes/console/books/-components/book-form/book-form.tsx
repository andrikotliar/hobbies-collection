import {
  BookReadStatus,
  convertEnumValuesToOption,
  type ListOption,
} from '@hobbies-collection/shared';
import { useMutation, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import type z from 'zod';
import {
  DescriptionEditor,
  getFormTitle,
  useFormModal,
  validateLanguage,
} from '~/routes/console/-shared';
import { BookOrderSelect } from '~/routes/console/books/-components/book-order-select/book-order-select';
import { BookFormSchema, getBookFormFullDefaultValues } from '~/routes/console/books/-configs';
import {
  Form,
  isNewItem,
  queryKey,
  api,
  type ApiResponse,
  type FormComponentProps,
  type MixedId,
  buildGetUserDataQueryOptions,
  Loader,
  uploadImage,
  getObjectsDiff,
  buildGetInitialDataQueryOptions,
} from '~/shared';

export type BookFormInitialValue = Omit<
  ApiResponse<typeof api.books.getAdminList>['list'][number],
  'id'
> & {
  id: MixedId;
};

type BookFormProps = FormComponentProps<BookFormInitialValue>;

const bookReadStatusOptions = convertEnumValuesToOption(Object.values(BookReadStatus));

export const BookForm = ({ values }: BookFormProps) => {
  const { onClose } = useFormModal();
  const { data: initialData } = useSuspenseQuery(buildGetInitialDataQueryOptions());
  const { data: user } = useQuery(buildGetUserDataQueryOptions());
  const { data: defaultValues, isLoading } = useQuery({
    queryKey: queryKey('books.getEditableBook', values.id),
    queryFn: async () => {
      if (isNewItem(values.id)) {
        return getBookFormFullDefaultValues();
      }

      const data = await api.books.getEditableBook({ params: { id: values.id } });

      return {
        ...data,
        id: values.id,
      };
    },
  });

  const { isPending, mutate } = useMutation({
    mutationFn: async (formData: z.infer<typeof BookFormSchema>) => {
      validateLanguage(formData.description, user);

      const imagePath = await uploadImage({
        image: formData.imagePath,
        title: formData.title,
        folder: 'books',
      });

      const input = {
        ...formData,
        imagePath,
      };

      if (!isNewItem(values.id)) {
        const diff = getObjectsDiff(defaultValues, input);

        if (!diff) {
          return;
        }

        return await api.books.updateBook({ params: { id: values.id }, input: diff });
      }

      return await api.books.createBook({ input });
    },
    onSuccess: onClose,
    meta: {
      invalidateQueries: [
        { queryKey: queryKey('books.getList') },
        { queryKey: queryKey('books.getAdminList') },
        { queryKey: ['books.getEditableBook'] },
      ],
    },
  });

  const { mutateAsync: createNewPerson, isPending: isPeoplePending } = useMutation({
    mutationFn: async ({ value }: { value: string }): Promise<ListOption<number>> => {
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

  if (isLoading) {
    return <Loader size={20} minLoaderHight={500} />;
  }

  return (
    <Form
      defaultValues={defaultValues}
      schema={BookFormSchema}
      onSubmit={mutate}
      title={getFormTitle(values, 'Book')}
      isLoading={isPending}
    >
      <Form.TextInput name="title" label="Title" />
      <Form.FileInput name="imagePath" label="Cover" />
      <Form.RatingInput name="rating" label="Rating" size={3} />
      <DescriptionEditor name="description" label="Description" />
      <Form.Select name="genres" label="Genres" isMulti options={initialData.options.genres} />
      <Form.TextInput name="publicationYear" label="Publication year" type="number" />
      <Form.TextInput name="pagesNumber" label="Pages number" type="number" />
      <Form.AsyncSelect
        name="authors"
        label="Authors"
        optionsLoader={api.people.search}
        queryKeyParams={{ key: queryKey('people.search')[0] }}
        isOptionsLoading={isPeoplePending}
        onCreateOption={(value) => createNewPerson({ value })}
        isMulti
      />
      <Form.AsyncSelect
        name="readingOrder"
        label="Reading order"
        optionsLoader={api.books.getReadingOrder}
        queryKeyParams={{ key: 'searchReadingOrder' }}
      />
      <Form.Select name="status" label="Status" options={bookReadStatusOptions} />
      <BookOrderSelect currentId={values.id} value={defaultValues?.firstBookId} />
    </Form>
  );
};

import { NEW_ITEM_ID } from '@hobbies-collection/shared';
import type z from 'zod';
import type { BookFormInitialValue } from '~/routes/console/books/-components';
import type { BookFormSchema } from './book-form-schema';

export const getBookFormBaseDefaultValues = (): Omit<BookFormInitialValue, 'publicationYear'> & {
  publicationYear: number;
} => ({
  id: NEW_ITEM_ID,
  title: '',
  imagePath: null,
  publicationYear: new Date().getFullYear(),
});

export const getBookFormFullDefaultValues = (): z.infer<typeof BookFormSchema> => {
  const baseValues = getBookFormBaseDefaultValues();

  return {
    ...baseValues,
    rating: 1,
    readingOrder: 1,
    status: 'PLANNED',
    description: '',
    genres: [],
    authors: [],
    seriesOrder: 1,
    pagesNumber: 1,
  };
};

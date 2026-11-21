import type z from 'zod';
import { NEW_ITEM_ID } from '@hobbies-collection/shared';
import { getTodayString } from '~/shared/helpers/get-today-string';
import type { FilmFormSchema } from '~/shared/schemas/film-form.schema';

export const filmDefaultFormValues: z.infer<typeof FilmFormSchema> = {
  id: NEW_ITEM_ID,
  title: '',
  type: 'FILM',
  imagePath: '',
  rating: 1,
  budget: 0,
  boxOffice: 0,
  duration: 0,
  releaseDate: getTodayString(),
  genres: [],
  studios: [],
  collections: [],
  countries: [],
  castAndCrew: [],
  awards: [],
  trailers: [],
  seriesExtension: null,
  draft: false,
};

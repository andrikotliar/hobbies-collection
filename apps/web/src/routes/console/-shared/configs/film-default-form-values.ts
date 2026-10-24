import type z from 'zod';
import { NEW_ITEM_ID } from '@hobbies-collection/shared';
import type { FilmFormSchema } from '~/routes/console/films_/-components/film-form/-schemas';
import { getTodayString } from '~/shared';

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

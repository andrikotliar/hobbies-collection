import type { FilmResponseSchema } from '@hobbies-collection/shared';
import type z from 'zod';
import type {
  Award,
  Collection,
  Country,
  Film,
  FilmPerson,
  FilmTrailer,
  Genre,
  Nomination,
  Person,
  SeriesExtension,
  Studio,
} from '~/database/schema.js';
import { sortGroupedPeople } from '~/modules/films/helpers/sort-grouped-people.js';
import type {
  GroupedAwards,
  GroupedPeople,
  PickBaseData,
  Timestamps,
} from '~/modules/films/types.js';
import { nullable } from '~/shared/helpers/nullable.js';

type ExtendedFilm = Omit<Film, 'draft' | 'addedAt' | Timestamps> & {
  genres: Array<{ genre: PickBaseData<Genre> }>;
  studios: Array<{ studio: PickBaseData<Studio> }>;
  countries: Array<{ country: PickBaseData<Country> }>;
  collections: Array<{ collection: Pick<Collection, 'id' | 'title' | 'category'> }>;
  castAndCrew: Array<
    Pick<FilmPerson, 'role' | 'details'> & {
      person: Pick<Person, 'id' | 'name'>;
    }
  >;
  awards: Array<{
    award: Pick<Award, 'id' | 'title'>;
    nomination: Pick<Nomination, 'id' | 'title'>;
    person: Pick<Person, 'id' | 'name'> | null;
  }>;
  seriesExtensions: Array<Pick<SeriesExtension, 'seasonsTotal' | 'episodesTotal'>>;
  trailers: FilmTrailer[];
};

const mapNestedRelations = <T extends Record<string, unknown>>(values: T[], selector: keyof T) => {
  return values.map((item) => item[selector]);
};

export const mapFilmDetails = (
  film: ExtendedFilm,
  postersUrl: string,
): z.infer<typeof FilmResponseSchema> => {
  const castAndCrew = film.castAndCrew.reduce((result, { role, details, person }) => {
    if (!result[role]) {
      result[role] = { role, people: [] };
    }

    result[role].people.push({
      ...person,
      details,
    });

    return result;
  }, {} as GroupedPeople);

  const awards = film.awards.reduce((result, award) => {
    if (!result[award.award.id]) {
      result[award.award.id] = {
        award: award.award,
        nominations: [],
      };
    }

    result[award.award.id].nominations.push({
      title: award.nomination.title,
      person: award.person,
    });

    return result;
  }, {} as GroupedAwards);

  const collections = film.collections.map(({ collection }) => ({
    id: collection.id,
    title: collection.title,
    category: collection.category,
  }));

  return {
    ...film,
    imagePath: film.imagePath ? postersUrl + film.imagePath : null,
    budget: film.budget ? Number(film.budget) : null,
    boxOffice: film.boxOffice ? Number(film.boxOffice) : null,
    genres: mapNestedRelations(film.genres, 'genre'),
    countries: mapNestedRelations(film.countries, 'country'),
    studios: mapNestedRelations(film.studios, 'studio'),
    collections,
    castAndCrew: sortGroupedPeople(castAndCrew),
    awards: Object.values(awards),
    seriesExtension: nullable(film.seriesExtensions[0]),
  };
};

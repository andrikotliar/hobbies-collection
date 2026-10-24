import { type CompleteDataListItem } from '@hobbies-collection/shared';
import type { Film, FilmPerson, FilmTrailer, Person, SeriesExtension } from '~/database/schema.js';
import type { Timestamps } from '~/modules/films/types.js';

type PropertyWithTitleAndId = {
  id: number;
  title: string;
};

type CompleteDataFilm = Omit<Film, 'rating' | 'draft' | 'addedAt' | Timestamps> & {
  genres: Array<{ genre: PropertyWithTitleAndId }>;
  studios: Array<{ studio: PropertyWithTitleAndId }>;
  countries: Array<{ country: PropertyWithTitleAndId }>;
  castAndCrew: Array<
    Pick<FilmPerson, 'role' | 'details'> & {
      person: Pick<Person, 'id' | 'name'>;
    }
  >;
  awards: Array<{
    award: PropertyWithTitleAndId;
    nomination: PropertyWithTitleAndId;
  }>;
  seriesExtensions: Array<Omit<SeriesExtension, Timestamps | 'filmId'>>;
  trailers: Array<Omit<FilmTrailer, Timestamps | 'filmId'>>;
};

type GroupedAwards = {
  [awardId: number]: {
    id: number;
    title: string;
    nominations: { id: number; title: string }[];
  };
};

const mapIndividualFilm = (film: CompleteDataFilm): CompleteDataListItem => {
  const awards = film.awards.reduce((result, award) => {
    if (!result[award.award.id]) {
      result[award.award.id] = {
        id: award.award.id,
        title: award.award.title,
        nominations: [],
      };
    }

    result[award.award.id].nominations.push({
      id: award.nomination.id,
      title: award.nomination.title,
    });

    return result;
  }, {} as GroupedAwards);

  const castAndCrew = film.castAndCrew.map((person) => ({
    id: person.person.id,
    name: person.person.name,
    role: person.role,
    details: person.details,
  }));

  return {
    ...film,
    genres: film.genres.map((item) => ({
      id: item.genre.id,
      title: item.genre.title,
    })),
    countries: film.countries.map((item) => ({
      id: item.country.id,
      title: item.country.title,
    })),
    studios: film.studios.map((item) => ({
      id: item.studio.id,
      title: item.studio.title,
    })),
    awards: Object.values(awards),
    castAndCrew,
    seriesExtension: film.seriesExtensions.length
      ? {
          id: film.seriesExtensions[0].id,
          seasonsTotal: film.seriesExtensions[0].seasonsTotal,
          episodesTotal: film.seriesExtensions[0].episodesTotal,
        }
      : undefined,
  };
};

export const mapCompleteDataList = (films: CompleteDataFilm[]): CompleteDataListItem[] => {
  return films.map(mapIndividualFilm);
};

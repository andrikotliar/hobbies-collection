import type { CreateFilmInput, Enum, PersonRole } from '@hobbies-collection/shared';
import type {
  Film,
  FilmAwardNomination,
  FilmCollection,
  FilmCountry,
  FilmGenre,
  FilmPerson,
  FilmStudio,
  FilmTrailer,
  SeriesExtension,
} from '~/database/schema.js';
import type { Timestamps } from '~/modules/films/types.js';
import { getTypedKeys } from '~/shared/helpers/get-typed-keys.js';

type EditableFilm = Omit<Film, Timestamps | 'addedAt' | 'id'> & {
  collections: Pick<FilmCollection, 'collectionId' | 'order'>[];
  genres: Pick<FilmGenre, 'genreId'>[];
  countries: Pick<FilmCountry, 'countryId'>[];
  studios: Pick<FilmStudio, 'studioId'>[];
  trailers: Pick<FilmTrailer, 'order' | 'url'>[];
  castAndCrew: Omit<FilmPerson, 'filmId' | Timestamps | 'id'>[];
  awards: Omit<FilmAwardNomination, Timestamps | 'filmId' | 'id'>[];
  seriesExtensions: SeriesExtension[];
};

export const mapInnerId = <T extends Record<string, number>>(
  entities: T[],
  key: keyof T,
): number[] => {
  return entities.map((item) => item[key]);
};

export const mapAdminFilmDetails = (film: EditableFilm, posterUrl: string): CreateFilmInput => {
  const groupedAwards = film.awards.reduce(
    (groups, award) => {
      if (!groups[award.awardId]) {
        groups[award.awardId] = [];
      }

      groups[award.awardId].push({
        nominationId: award.nominationId,
        actorId: award.actorId,
      });

      return groups;
    },
    {} as Record<number, CreateFilmInput['awards'][number]['nominations']>,
  );

  const groupedPeople = film.castAndCrew.reduce(
    (groups, item) => {
      if (!groups[item.role]) {
        groups[item.role] = [];
      }

      groups[item.role].push({
        personId: item.personId,
        details: item.details,
      });

      return groups;
    },
    {} as Record<Enum<typeof PersonRole>, CreateFilmInput['castAndCrew'][number]['people']>,
  );

  return {
    ...film,
    imagePath: film.imagePath ? `${posterUrl}${film.imagePath}` : null,
    genres: mapInnerId(film.genres, 'genreId'),
    countries: mapInnerId(film.countries, 'countryId'),
    studios: mapInnerId(film.studios, 'studioId'),
    collections: film.collections,
    releaseDate: film.releaseDate ? film.releaseDate.split('T')[0] : null,
    castAndCrew: getTypedKeys(groupedPeople).map((key) => {
      return {
        role: key,
        people: groupedPeople[key],
      };
    }),
    awards: Object.keys(groupedAwards).map((key) => ({
      awardId: Number(key),
      nominations: groupedAwards[Number(key)],
    })),
    seriesExtension: film.seriesExtensions.length
      ? {
          episodesTotal: film.seriesExtensions[0].episodesTotal,
          seasonsTotal: film.seriesExtensions[0].seasonsTotal,
        }
      : null,
  };
};

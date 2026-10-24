import type { CompleteDataResponse, CompleteDataListItem } from '@hobbies-collection/shared';
import { database } from '~/plugins/database.plugin.js';
import {
  awards,
  countries,
  filmAwardNominations,
  films,
  filmsCountries,
  filmsGenres,
  filmsPeople,
  filmsStudios,
  filmTrailers,
  genres,
  nominations,
  people,
  seriesExtensions,
  studios,
} from '~/database/schema.js';
import { getItems } from './helpers/get-items.js';
import { getBaseDataValues } from './helpers/get-base-data-values.js';
import { logger } from './helpers/logger.js';
import { getMaxIdAndRestartAutoIncrement } from './helpers/get-max-id-and-restart-autoincrement.js';

const folders = {
  films: '/data/films',
  common: '/data/common',
};

const seedFilms = async () => {
  const filmsList = await getItems<CompleteDataListItem>(folders.films);
  const baseData = await getBaseDataValues<CompleteDataResponse['baseData']>([
    folders.common,
    folders.films,
  ]);

  const filmsDataConfig = [
    {
      data: baseData.genres,
      table: genres,
    },
    {
      data: baseData.countries,
      table: countries,
    },
    {
      data: baseData.studios,
      table: studios,
    },
    {
      data: baseData.people,
      table: people,
    },
  ];

  await database.transaction(async (tr) => {
    logger.info('Seeding films base data');
    for (const configItem of filmsDataConfig) {
      await tr.insert(configItem.table).values(configItem.data);
    }

    for (const award of baseData.awards) {
      const { nominations: nominationValues, ...awardInput } = award;

      await tr.insert(awards).values(awardInput);

      await tr.insert(nominations).values(
        nominationValues.map((nomination) => ({
          ...nomination,
          awardId: awardInput.id,
        })),
      );
    }

    logger.info('Base data seeded');
    logger.info('Seeding films');

    for (const film of filmsList) {
      const {
        countries,
        studios,
        genres,
        seriesExtension,
        trailers,
        castAndCrew,
        awards,
        ...filmDetails
      } = film;

      const [createdFilm] = await tr
        .insert(films)
        .values({
          ...filmDetails,
          rating: 3,
          budget: filmDetails.budget ?? 0,
          boxOffice: filmDetails.boxOffice ?? 0,
        })
        .returning({ id: films.id });

      const filmId = createdFilm.id;

      if (countries.length) {
        const input = countries.map((item) => ({
          countryId: item.id,
          filmId,
        }));

        await tr.insert(filmsCountries).values(input);
      }

      if (genres.length) {
        const input = genres.map((item) => ({
          genreId: item.id,
          filmId,
        }));

        await tr.insert(filmsGenres).values(input);
      }

      if (studios.length) {
        const input = studios.map((item) => ({
          studioId: item.id,
          filmId,
        }));

        await tr.insert(filmsStudios).values(input);
      }

      if (trailers.length) {
        await tr.insert(filmTrailers).values(
          trailers.map((trailer) => ({
            ...trailer,
            filmId,
          })),
        );
      }

      if (seriesExtension) {
        await tr.insert(seriesExtensions).values({
          ...seriesExtension,
          filmId,
        });
      }

      if (awards.length) {
        for (const award of awards) {
          await tr.insert(filmAwardNominations).values(
            award.nominations.map((nomination) => ({
              awardId: award.id,
              nominationId: nomination.id,
              filmId,
            })),
          );
        }
      }

      if (castAndCrew) {
        for (const person of castAndCrew) {
          await tr.insert(filmsPeople).values({
            filmId,
            role: person.role,
            details: person.details,
            personId: person.id,
          });
        }
      }
    }

    await getMaxIdAndRestartAutoIncrement(tr, awards, 'awards');
    await getMaxIdAndRestartAutoIncrement(tr, nominations, 'nominations');
    await getMaxIdAndRestartAutoIncrement(tr, genres, 'genres');
    await getMaxIdAndRestartAutoIncrement(tr, countries, 'countries');
    await getMaxIdAndRestartAutoIncrement(tr, studios, 'studios');
    await getMaxIdAndRestartAutoIncrement(tr, people, 'people');
    await getMaxIdAndRestartAutoIncrement(tr, films, 'films');
  });

  logger.success('Seeding films completed');
};

const run = async () => {
  await seedFilms();
};

run().catch((error) => {
  logger.error(error);
  process.exit(1);
});

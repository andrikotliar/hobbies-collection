import {
  DraftLevel,
  enumValues,
  FilmType,
  type GetAdminListQueryParams,
  type GetFilmsListQuery,
  type TDraftLevel,
} from '@hobbies-collection/shared';
import {
  and,
  between,
  eq,
  exists,
  gt,
  gte,
  ilike,
  inArray,
  isNull,
  lt,
  lte,
  notExists,
  notInArray,
  or,
  sql,
  type SQL,
} from 'drizzle-orm';
import type { PgColumn } from 'drizzle-orm/pg-core';
import {
  filmAwardNominations,
  films,
  filmsCollections,
  filmsCountries,
  filmsGenres,
  filmsPeople,
  filmsStudios,
  filmTrailers,
  seriesExtensions,
} from '~/database/schema.js';
import type { Database } from '~/plugins/index.js';
import { sqlSearchQuery } from '~/shared/helpers/sql-search-query.js';
import { thisDateReleaseSql } from '~/shared/helpers/this-date-release-sql.js';

const MONEY_RANGE_MILLIONS = 10_000_000;

export type PlainFilmFilters = GetFilmsListQuery & GetAdminListQueryParams;

type SqlOrUndefined = SQL | undefined;

type MappedFilters = {
  filters: SqlOrUndefined[];
  drafts: SqlOrUndefined;
};

const getMoneyRangeFilter = (column: PgColumn, value: number) => {
  if (value < MONEY_RANGE_MILLIONS) {
    return between(column, 0, value + MONEY_RANGE_MILLIONS);
  }

  return between(column, value - MONEY_RANGE_MILLIONS, value + MONEY_RANGE_MILLIONS);
};

type DraftLevel = 'all' | 'upcoming' | 'none';

const getDraftFilter = (levels: Array<TDraftLevel>): SqlOrUndefined => {
  if (levels.length === enumValues(DraftLevel).length) {
    return undefined;
  }

  const levelsSet = new Set(levels);

  const isDraftIncluded = levelsSet.has(DraftLevel.PENDING);

  const query: SqlOrUndefined[] = [eq(films.draft, isDraftIncluded)];

  if (levelsSet.has(DraftLevel.UPCOMING)) {
    const releaseDateQuery = gt(films.releaseDate, sql`CURRENT_DATE`);

    if (levelsSet.size === 1) {
      return releaseDateQuery;
    }
    query.push(gt(films.releaseDate, sql`CURRENT_DATE`));
  } else {
    query.push(lt(films.releaseDate, sql`CURRENT_DATE`));
    return and(...query);
  }

  return or(...query);
};

export const mapListFilters = (plainFilters: PlainFilmFilters, db: Database): MappedFilters => {
  const {
    genreIds,
    collectionId,
    studioIds,
    countryIds,
    type,
    startDate,
    endDate,
    rating,
    seasonsTotal,
    episodesTotal,
    duration,
    personId,
    personRole,
    awardId,
    budget,
    boxOffice,
    q,
    draftLevels = [],
    releasedThisDay,
    noBoxOffice,
    noCrewOrCast,
    noTrailers,
    runtimeRange,
    incompleteBoxOffice,
    year,
    originFilmId,
  } = plainFilters;

  const filters: SqlOrUndefined[] = [isNull(films.deletedAt)];

  if (startDate) {
    filters.push(gte(films.releaseDate, startDate));
  }

  if (endDate) {
    filters.push(lte(films.releaseDate, endDate));
  }

  if (type) {
    filters.push(eq(films.type, type));
  }

  if (genreIds) {
    filters.push(
      exists(
        db
          .select()
          .from(filmsGenres)
          .where(and(eq(films.id, filmsGenres.filmId), inArray(filmsGenres.genreId, genreIds))),
      ),
    );
  }

  if (studioIds) {
    filters.push(
      exists(
        db
          .select()
          .from(filmsStudios)
          .where(and(eq(films.id, filmsStudios.filmId), inArray(filmsStudios.studioId, studioIds))),
      ),
    );
  }

  if (countryIds) {
    filters.push(
      exists(
        db
          .select()
          .from(filmsCountries)
          .where(
            and(eq(films.id, filmsCountries.filmId), inArray(filmsCountries.countryId, countryIds)),
          ),
      ),
    );
  }

  if (collectionId) {
    filters.push(
      exists(
        db
          .select()
          .from(filmsCollections)
          .where(
            and(
              eq(films.id, filmsCollections.filmId),
              eq(filmsCollections.collectionId, collectionId),
            ),
          ),
      ),
    );
  }

  if (rating) {
    filters.push(eq(films.rating, rating));
  }

  if (duration && !runtimeRange) {
    filters.push(eq(films.duration, duration));
  }

  if (runtimeRange) {
    filters.push(between(films.duration, runtimeRange[0], runtimeRange[1]));
  }

  if (seasonsTotal) {
    filters.push(
      exists(
        db
          .select()
          .from(seriesExtensions)
          .where(
            and(
              eq(films.id, seriesExtensions.filmId),
              eq(seriesExtensions.seasonsTotal, seasonsTotal),
            ),
          ),
      ),
    );
  }

  if (episodesTotal) {
    filters.push(
      exists(
        db
          .select()
          .from(seriesExtensions)
          .where(
            and(
              eq(films.id, seriesExtensions.filmId),
              eq(seriesExtensions.episodesTotal, episodesTotal),
            ),
          ),
      ),
    );
  }

  if (personId && personRole) {
    filters.push(
      exists(
        db
          .select()
          .from(filmsPeople)
          .where(
            and(
              eq(filmsPeople.filmId, films.id),
              eq(filmsPeople.personId, personId),
              eq(filmsPeople.role, personRole),
            ),
          ),
      ),
    );
  }

  if (awardId) {
    filters.push(
      exists(
        db
          .select()
          .from(filmAwardNominations)
          .where(
            and(
              eq(films.id, filmAwardNominations.filmId),
              eq(filmAwardNominations.awardId, awardId),
            ),
          ),
      ),
    );
  }

  if (budget) {
    filters.push(getMoneyRangeFilter(films.budget, budget));
  }

  if (boxOffice) {
    filters.push(getMoneyRangeFilter(films.boxOffice, boxOffice));
  }

  if (q) {
    filters.push(ilike(films.title, sqlSearchQuery(q)));
  }

  if (noBoxOffice && type !== 'SERIES') {
    filters.push(and(eq(films.boxOffice, 0), notInArray(films.type, ['SERIES'])));
  }

  if (noCrewOrCast) {
    filters.push(notExists(db.select().from(filmsPeople).where(eq(films.id, filmsPeople.filmId))));
  }

  if (noTrailers) {
    filters.push(
      notExists(db.select().from(filmTrailers).where(eq(films.id, filmTrailers.filmId))),
    );
  }

  if (releasedThisDay) {
    filters.push(thisDateReleaseSql());
  }

  if (incompleteBoxOffice) {
    filters.push(
      sql`type <> ${FilmType.SERIES} AND draft = false and (box_office = 0 OR (EXTRACT(DAY FROM updated_at - release_date) < 90) AND release_date < NOW())`,
    );
  }

  if (year && !startDate && !endDate) {
    filters.push(sql`EXTRACT(YEAR from release_date) = ${year}`);
  }

  if (originFilmId) {
    filters.push(or(eq(films.id, originFilmId), eq(films.originFilmId, originFilmId)));
  }

  return { filters, drafts: getDraftFilter(draftLevels) };
};

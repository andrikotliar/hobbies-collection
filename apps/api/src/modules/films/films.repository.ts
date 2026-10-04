import {
  CollectionCategory,
  getSkipValue,
  PAGE_LIMITS,
  type CreateFilmDraftInput,
  type CreateFilmInput,
  type GetCompleteDataListQuery,
  type GetFilmOptionsQuery,
  type SortingOrder,
  type UpdateFilmInput,
} from '@hobbies-collection/shared';
import { mapListFilters, type PlainFilmFilters } from '~/modules/films/helpers/index.js';
import {
  and,
  asc,
  count,
  desc,
  eq,
  ilike,
  inArray,
  isNotNull,
  isNull,
  lt,
  ne,
  notInArray,
  sql,
  type SQL,
} from 'drizzle-orm';
import {
  collections,
  countries,
  filmAwardNominations,
  films,
  filmsCollections,
  filmsCountries,
  filmsDrafts,
  filmsGenres,
  filmsPeople,
  filmsStudios,
  filmTrailers,
  genres,
  seriesExtensions,
  studios,
  type Film,
  type FilmCollection,
} from '~/database/schema.js';
import type { Timestamps } from '~/modules/films/types.js';
import type { Deps } from '~/shared/types/deps.js';
import { getFirstValue } from '~/shared/helpers/get-first-value.js';
import { sqlSearchQuery } from '~/shared/helpers/sql-search-query.js';
import { getLatestEntriesFilter } from '~/shared/helpers/get-latest-entries-filter.js';
import { thisDateReleaseSql } from '~/shared/helpers/this-date-release-sql.js';
import { getDirectionFn } from '~/shared/helpers/get-direction-fn.js';
import { updateTableRelations } from '~/shared/helpers/update-table-relations.js';

type FilterLevel = 'public' | 'admin';

export class FilmsRepository {
  constructor(private readonly deps: Deps<'db'>) {}

  async count(filters?: (SQL | undefined)[]) {
    if (filters) {
      const result = await getFirstValue(
        this.deps.db
          .select({ count: count() })
          .from(films)
          .where(and(...filters)),
      );

      return result?.count ?? 0;
    }

    const result = await getFirstValue(this.deps.db.select({ count: count() }).from(films));

    return result?.count ?? 0;
  }

  async countPublishedFilms() {
    return this.count([eq(films.draft, false), isNull(films.deletedAt)]);
  }

  async findAndCount(queries: PlainFilmFilters, level: FilterLevel = 'public') {
    const { filters, drafts } = mapListFilters(queries, this.deps.db);
    const sorting = this.mapSorting(queries.orderKey, queries.order);

    const total = await this.count([
      ...filters,
      level === 'admin' ? drafts : eq(films.draft, false),
    ]);

    const baseQuery = this.deps.db
      .select({
        id: films.id,
        title: films.title,
        imagePath: films.imagePath,
        releaseDate: films.releaseDate,
        draft: films.draft,
      })
      .from(films)
      .where(and(...filters, drafts));

    if (queries.collectionId) {
      const list = await baseQuery;
      return { total, list, type: 'unsorted' as const };
    }

    const list = await baseQuery
      .limit(PAGE_LIMITS.filmsList)
      .offset(getSkipValue('filmsList', queries.pageIndex))
      .orderBy(sorting, asc(films.id));

    return { list, total, type: 'sorted' as const };
  }

  getCollectionOrder(collectionId: number) {
    return this.deps.db
      .select({ filmId: filmsCollections.filmId, order: filmsCollections.order })
      .from(filmsCollections)
      .where(eq(filmsCollections.collectionId, collectionId));
  }

  findById(id: number, level: FilterLevel = 'public') {
    const where = [eq(films.id, id), isNull(films.deletedAt)];

    if (level === 'public') {
      where.push(eq(films.draft, false));
    }

    return this.deps.db.query.films.findFirst({
      where: and(...where),
      columns: {
        id: true,
        title: true,
        imagePath: true,
        releaseDate: true,
        duration: true,
        budget: true,
        boxOffice: true,
        rating: true,
        type: true,
        description: true,
      },
      with: {
        genres: {
          with: {
            genre: {
              columns: {
                id: true,
                title: true,
              },
            },
          },
        },
        countries: {
          with: {
            country: {
              columns: {
                id: true,
                title: true,
              },
            },
          },
        },
        studios: {
          with: {
            studio: {
              columns: {
                id: true,
                title: true,
              },
            },
          },
        },
        seriesExtensions: {
          columns: {
            seasonsTotal: true,
            episodesTotal: true,
          },
        },
        castAndCrew: {
          columns: {
            role: true,
            details: true,
          },
          with: {
            person: {
              columns: {
                id: true,
                name: true,
              },
            },
          },
        },
        awards: {
          with: {
            award: {
              columns: {
                id: true,
                title: true,
              },
            },
            nomination: {
              columns: {
                id: true,
                title: true,
              },
            },
            person: {
              columns: {
                id: true,
                name: true,
              },
            },
          },
        },
        collections: {
          with: {
            collection: {
              columns: {
                id: true,
                title: true,
                category: true,
              },
            },
          },
        },
        trailers: {
          orderBy: asc(filmTrailers.order),
        },
      },
    });
  }

  findByIdAdmin(id: number) {
    return this.deps.db.query.films.findFirst({
      where: and(eq(films.id, id), isNull(films.deletedAt)),
      columns: {
        id: true,
        title: true,
        type: true,
        imagePath: true,
        rating: true,
        budget: true,
        boxOffice: true,
        duration: true,
        releaseDate: true,
      },
      with: {
        genres: {
          columns: {
            genreId: true,
          },
        },
        countries: {
          columns: {
            countryId: true,
          },
        },
        studios: {
          columns: {
            studioId: true,
          },
        },
        collections: {
          columns: {
            collectionId: true,
          },
        },
        trailers: {
          columns: {
            url: true,
            order: true,
          },
        },
        castAndCrew: {
          columns: {
            role: true,
            details: true,
          },
          with: {
            person: {
              columns: {
                id: true,
                name: true,
              },
            },
          },
        },
        awards: {
          columns: {
            awardId: true,
            nominationId: true,
          },
          with: {
            person: true,
          },
        },
      },
    });
  }

  searchByTitle(query: string) {
    return this.deps.db.query.films.findMany({
      columns: {
        id: true,
        title: true,
        imagePath: true,
        releaseDate: true,
      },
      with: {
        genres: {
          with: {
            genre: true,
          },
        },
      },
      where: and(
        isNull(films.deletedAt),
        ilike(films.title, sqlSearchQuery(query)),
        eq(films.draft, false),
      ),
      limit: PAGE_LIMITS.filmsSearch,
    });
  }

  async getFilmsListByQuery({ q, selected }: GetFilmOptionsQuery) {
    const filters: SQL[] = [isNull(films.deletedAt)];

    if (q) {
      filters.push(ilike(films.title, sqlSearchQuery(q)));
    }

    if (selected) {
      filters.push(notInArray(films.id, selected));
    }

    const queryResult = await this.deps.db
      .select({ id: films.id, title: films.title })
      .from(films)
      .where(and(...filters))
      .limit(PAGE_LIMITS.default)
      .orderBy(asc(films.title));

    if (selected) {
      const selectedFilms = await this.deps.db
        .select({ id: films.id, title: films.title })
        .from(films)
        .where(inArray(films.id, selected));

      return [...queryResult, ...selectedFilms];
    }

    return queryResult;
  }

  async softDelete(id: number, date: string) {
    await this.deps.db.update(films).set({ deletedAt: date }).where(eq(films.id, id));
  }

  create(input: Omit<CreateFilmInput, 'tempDraftId'>) {
    const {
      castAndCrew,
      awards,
      genres,
      countries,
      studios,
      collections,
      trailers,
      seriesExtension,
      ...filmInput
    } = input;

    return this.deps.db.transaction(async (tr) => {
      const [newFilm] = await tr
        .insert(films)
        .values({ ...filmInput, addedAt: filmInput.draft ? null : new Date().toISOString() })
        .returning({ id: films.id });

      const filmId = newFilm.id;

      if (castAndCrew.length) {
        const values = castAndCrew.map((item) => {
          const people = item.people;

          return people.map((person) => ({
            ...person,
            filmId,
            role: item.role,
          }));
        });
        await tr.insert(filmsPeople).values(values.flat());
      }

      if (awards.length) {
        const values = awards.map((award) => {
          const nominations = award.nominations;

          return nominations.map((nomination) => ({
            ...nomination,
            awardId: award.awardId,
            filmId,
          }));
        });

        await tr.insert(filmAwardNominations).values(values.flat());
      }

      if (genres.length) {
        const values = genres.map((genreId) => ({ genreId, filmId }));

        await tr.insert(filmsGenres).values(values);
      }

      if (countries.length) {
        const values = countries.map((countryId) => ({ countryId, filmId }));

        await tr.insert(filmsCountries).values(values);
      }

      if (studios.length) {
        const values = studios.map((studioId) => ({ studioId, filmId }));

        await tr.insert(filmsStudios).values(values);
      }

      if (collections.length) {
        const values = collections.map((collection) => ({
          collectionId: collection.collectionId,
          filmId,
          order: collection.order,
        }));

        await tr.insert(filmsCollections).values(values);
      }

      if (trailers.length) {
        const values = trailers.map((trailer) => ({ ...trailer, filmId }));
        await tr.insert(filmTrailers).values(values);
      }

      if (seriesExtension) {
        await tr.insert(seriesExtensions).values({
          ...seriesExtension,
          filmId,
        });
      }

      return { filmId };
    });
  }

  getEditableFilm(id: number) {
    return this.deps.db.query.films.findFirst({
      where: eq(films.id, id),
      columns: {
        title: true,
        type: true,
        rating: true,
        imagePath: true,
        duration: true,
        releaseDate: true,
        budget: true,
        boxOffice: true,
        description: true,
        draft: true,
      },
      with: {
        genres: {
          columns: {
            genreId: true,
          },
        },
        studios: {
          columns: {
            studioId: true,
          },
        },
        countries: {
          columns: {
            countryId: true,
          },
        },
        collections: {
          columns: {
            collectionId: true,
            order: true,
          },
        },
        castAndCrew: {
          columns: {
            personId: true,
            role: true,
            details: true,
          },
        },
        awards: {
          columns: {
            awardId: true,
            nominationId: true,
            actorId: true,
          },
        },
        trailers: {
          columns: {
            order: true,
            url: true,
          },
        },
        seriesExtensions: true,
      },
    });
  }

  updateFilm(filmId: number, data: UpdateFilmInput) {
    const {
      castAndCrew,
      awards,
      genres,
      collections,
      countries,
      studios,
      seriesExtension,
      trailers,
      ...filmParams
    } = data;

    return this.deps.db.transaction(async (transaction) => {
      const existingFilmData = await transaction
        .select({ draft: films.draft, addedAt: films.addedAt })
        .from(films)
        .where(eq(films.id, filmId));

      const now = new Date().toISOString();
      const previousDraftValues = existingFilmData[0]?.draft;
      const addedAtValue =
        previousDraftValues !== filmParams.draft ? now : existingFilmData[0].addedAt;

      const [updatedFilm] = await transaction
        .update(films)
        .set({ ...filmParams, updatedAt: now, addedAt: addedAtValue })
        .where(eq(films.id, filmId))
        .returning({ id: films.id });

      if (genres) {
        await updateTableRelations({
          transaction,
          where: { filmId },
          table: filmsGenres,
          values: genres.map((genreId) => ({
            genreId,
            filmId,
          })),
        });
      }

      if (castAndCrew) {
        const values = castAndCrew.map((item) => {
          return item.people.map((person) => ({
            ...person,
            filmId,
            role: item.role,
          }));
        });

        await updateTableRelations({
          transaction,
          where: { filmId },
          table: filmsPeople,
          values: values.flat(),
        });
      }

      if (awards) {
        const values = awards.map((award) => {
          return award.nominations.map((nomination) => ({
            ...nomination,
            awardId: award.awardId,
            filmId,
          }));
        });

        await updateTableRelations({
          transaction,
          where: { filmId },
          table: filmAwardNominations,
          values: values.flat(),
        });
      }

      if (collections) {
        await updateTableRelations({
          transaction,
          where: { filmId },
          table: filmsCollections,
          values: collections.map((collection) => ({
            collectionId: collection.collectionId,
            filmId,
            order: collection.order,
          })),
        });
      }

      if (countries) {
        await updateTableRelations({
          transaction,
          where: { filmId },
          table: filmsCountries,
          values: countries.map((countryId) => ({
            countryId,
            filmId,
          })),
        });
      }

      if (studios) {
        await updateTableRelations({
          transaction,
          where: { filmId },
          table: filmsStudios,
          values: studios.map((studioId) => ({
            studioId,
            filmId,
          })),
        });
      }

      if (trailers) {
        await updateTableRelations({
          transaction,
          where: { filmId },
          table: filmTrailers,
          values: trailers.map((trailer) => ({
            ...trailer,
            filmId,
          })),
        });
      }

      if (seriesExtension) {
        await updateTableRelations({
          transaction,
          where: { filmId },
          table: seriesExtensions,
          values: [
            {
              ...seriesExtension,
              filmId,
            },
          ],
        });
      }

      return {
        filmId: updatedFilm.id,
      };
    });
  }

  getCompleteData(queries: GetCompleteDataListQuery) {
    const filters: SQL[] = [eq(films.draft, false)];

    if (queries.intervalDays) {
      filters.push(getLatestEntriesFilter(films.updatedAt, queries.intervalDays));
    }

    return this.deps.db.query.films.findMany({
      where: and(...filters),
      orderBy: desc(films.updatedAt),
      columns: {
        id: true,
        title: true,
        releaseDate: true,
        duration: true,
        description: true,
        budget: true,
        boxOffice: true,
        type: true,
        imagePath: true,
      },
      with: {
        countries: {
          with: {
            country: {
              columns: {
                id: true,
                title: true,
              },
            },
          },
        },
        genres: {
          with: {
            genre: {
              columns: {
                id: true,
                title: true,
              },
            },
          },
        },
        studios: {
          with: {
            studio: {
              columns: {
                id: true,
                title: true,
              },
            },
          },
        },
        castAndCrew: {
          columns: {
            role: true,
            details: true,
          },
          with: {
            person: {
              columns: {
                id: true,
                name: true,
              },
            },
          },
        },
        awards: {
          with: {
            award: {
              columns: {
                id: true,
                title: true,
              },
            },
            nomination: {
              columns: {
                id: true,
                title: true,
              },
            },
          },
        },
        seriesExtensions: {
          columns: {
            id: true,
            episodesTotal: true,
            seasonsTotal: true,
          },
        },
        trailers: {
          columns: {
            id: true,
            url: true,
            order: true,
          },
        },
        collections: {
          columns: {
            order: true,
          },
          with: {
            collection: {
              columns: {
                title: true,
                id: true,
                category: true,
              },
            },
          },
        },
      },
    });
  }

  createDraft(filmId: string, input: CreateFilmDraftInput) {
    return getFirstValue(
      this.deps.db
        .insert(filmsDrafts)
        .values({
          filmId,
          content: input.content,
        })
        .returning(),
    );
  }

  updateDraft(id: number, content: Record<string, unknown>) {
    return getFirstValue(
      this.deps.db
        .update(filmsDrafts)
        .set({
          content,
        })
        .where(eq(filmsDrafts.id, id))
        .returning(),
    );
  }

  getDrafts(filmId: string) {
    return this.deps.db
      .select()
      .from(filmsDrafts)
      .where(eq(filmsDrafts.filmId, filmId))
      .orderBy(desc(filmsDrafts.updatedAt));
  }

  deleteDraft(id: number) {
    return this.deps.db.delete(filmsDrafts).where(eq(filmsDrafts.id, id));
  }

  deleteAllDraftsOfFilm(filmId: string) {
    return this.deps.db.delete(filmsDrafts).where(eq(filmsDrafts.filmId, filmId));
  }

  getFilmByCollectionTitleAndDay(title: string) {
    const now = new Date();
    const dayOfMonth = now.getDate();
    const digit = Math.abs(dayOfMonth) % 10;
    const orderValue = digit === 0 ? 10 : digit;

    return getFirstValue(
      this.deps.db
        .select({
          id: films.id,
          title: films.title,
          imagePath: films.imagePath,
          order: filmsCollections.order,
        })
        .from(films)
        .innerJoin(
          filmsCollections,
          and(eq(filmsCollections.filmId, films.id), eq(filmsCollections.order, orderValue)),
        )
        .innerJoin(
          collections,
          and(eq(collections.id, filmsCollections.collectionId), eq(collections.title, title)),
        ),
    );
  }

  aggregateFilmGenres() {
    return this.deps.db
      .select({
        id: genres.id,
        title: genres.title,
        value: count(),
      })
      .from(filmsGenres)
      .innerJoin(films, eq(films.id, filmsGenres.filmId))
      .innerJoin(genres, eq(genres.id, filmsGenres.genreId))
      .where(this.getPublicFilmsFilter())
      .groupBy(genres.id, genres.title)
      .orderBy(asc(genres.title));
  }

  aggregateFilmCollections() {
    return this.deps.db
      .select({
        id: collections.id,
        title: collections.title,
        value: count(),
      })
      .from(filmsCollections)
      .innerJoin(films, eq(films.id, filmsCollections.filmId))
      .innerJoin(collections, eq(collections.id, filmsCollections.collectionId))
      .where(this.getPublicFilmsFilter([ne(collections.category, CollectionCategory.CHAPTER)]))
      .groupBy(collections.id, collections.title)
      .orderBy(collections.title);
  }

  aggregateFilmCountries() {
    return this.deps.db
      .select({
        id: countries.id,
        title: countries.title,
        value: count(),
      })
      .from(filmsCountries)
      .innerJoin(films, eq(films.id, filmsCountries.filmId))
      .innerJoin(countries, eq(countries.id, filmsCountries.countryId))
      .where(this.getPublicFilmsFilter())
      .groupBy(countries.id, countries.title)
      .orderBy(countries.title);
  }

  aggregateFilmStudios() {
    return this.deps.db
      .select({
        id: studios.id,
        title: studios.title,
        value: count(),
      })
      .from(filmsStudios)
      .innerJoin(films, eq(films.id, filmsStudios.filmId))
      .innerJoin(studios, eq(studios.id, filmsStudios.studioId))
      .where(this.getPublicFilmsFilter())
      .groupBy(studios.id, studios.title)
      .orderBy(studios.title);
  }

  aggregateFilmTypes() {
    return this.deps.db
      .select({ title: films.type, value: count() })
      .from(films)
      .where(this.getPublicFilmsFilter())
      .groupBy(films.type)
      .orderBy(films.type);
  }

  getTrailersByFilmId(id: number) {
    return this.deps.db
      .select({ url: filmTrailers.url })
      .from(filmTrailers)
      .where(and(eq(filmTrailers.filmId, id)));
  }

  getByCollectionId(collectionId: number) {
    return this.deps.db
      .select({
        id: films.id,
        title: films.title,
        imagePath: films.imagePath,
        order: filmsCollections.order,
      })
      .from(films)
      .innerJoin(
        filmsCollections,
        and(eq(films.id, filmsCollections.filmId), eq(filmsCollections.collectionId, collectionId)),
      )
      .orderBy(asc(filmsCollections.order));
  }

  async getAnniversaries() {
    const list = await this.deps.db
      .select({ imagePath: films.imagePath })
      .from(films)
      .where(
        and(
          eq(films.draft, false),
          isNull(films.deletedAt),
          isNotNull(films.imagePath),
          sql`LENGTH(image_path) > 0`,
          thisDateReleaseSql(),
        ),
      );

    return list;
  }

  private getPublicFilmsFilter(additionalFilters: SQL[] = []) {
    const today = new Date().toISOString();
    return and(
      isNull(films.deletedAt),
      eq(films.draft, false),
      lt(films.releaseDate, today),
      ...additionalFilters,
    );
  }

  linkFilmToCollection(input: Omit<FilmCollection, Timestamps | 'id'>[]) {
    return this.deps.db.insert(filmsCollections).values(input);
  }

  unlinkCollection(collectionId: number) {
    return this.deps.db
      .delete(filmsCollections)
      .where(eq(filmsCollections.collectionId, collectionId));
  }

  private mapSorting(key: string = 'releaseDate', direction: SortingOrder = 'desc') {
    const fn = getDirectionFn(direction);
    return fn(films[key as keyof Film]);
  }
}

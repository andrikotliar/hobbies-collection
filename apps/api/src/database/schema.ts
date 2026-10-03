import {
  CollectionCategory,
  type DeviceInfo,
  PersonRole,
  FilmType,
} from '@hobbies-collection/shared';
import {
  pgTable,
  index,
  foreignKey,
  serial,
  text,
  date,
  integer,
  bigint,
  timestamp,
  boolean,
  uniqueIndex,
  pgEnum,
  numeric,
  jsonb,
  varchar,
  unique,
} from 'drizzle-orm/pg-core';

export const collectionCategory = pgEnum('collection_category', CollectionCategory);
export const personRole = pgEnum('person_role', PersonRole);
export const filmType = pgEnum('title_type', FilmType);

export const films = pgTable(
  'films',
  {
    id: serial().primaryKey().notNull(),
    title: text().notNull(),
    type: filmType().default('FILM').notNull(),
    releaseDate: date('release_date'),
    duration: integer().default(0).notNull(),
    imagePath: text('image_path'),
    budget: bigint({ mode: 'number' }).default(0).notNull(),
    boxOffice: bigint('box_office', { mode: 'number' }).default(0).notNull(),
    rating: integer().default(1).notNull(),
    addedAt: timestamp('added_at', { precision: 3, mode: 'string', withTimezone: true }),
    createdAt: timestamp('created_at', { precision: 3, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { precision: 3, mode: 'string' })
      .defaultNow()
      .$onUpdate(() => new Date().toISOString())
      .notNull(),
    deletedAt: timestamp('deleted_at', { precision: 3, mode: 'string' }),
    description: text(),
    draft: boolean().notNull().default(false),
  },
  (table) => [
    index('films_title_idx').using('btree', table.title.asc().nullsLast().op('text_ops')),
  ],
);

export const awards = pgTable(
  'awards',
  {
    id: serial().primaryKey().notNull(),
    title: text().notNull(),
    description: text(),
    createdAt: timestamp('created_at', { precision: 3, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { precision: 3, mode: 'string' })
      .defaultNow()
      .$onUpdate(() => new Date().toISOString())
      .notNull(),
  },
  (table) => [
    uniqueIndex('awards_title_key').using('btree', table.title.asc().nullsLast().op('text_ops')),
  ],
);

export const collections = pgTable(
  'collections',
  {
    id: serial().primaryKey().notNull(),
    title: text().notNull(),
    description: text(),
    category: collectionCategory().default('GENERAL').notNull(),
    createdAt: timestamp('created_at', { precision: 3, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { precision: 3, mode: 'string' })
      .defaultNow()
      .$onUpdate(() => new Date().toISOString())
      .notNull(),
  },
  (table) => [
    uniqueIndex('collections_title_key').using(
      'btree',
      table.title.asc().nullsLast().op('text_ops'),
    ),
  ],
);

export const collectionEvents = pgTable(
  'collection_events',
  {
    id: serial().primaryKey().notNull(),
    title: text().notNull(),
    collectionId: integer('collection_id').notNull(),
    createdAt: timestamp('created_at', { precision: 3, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { precision: 3, mode: 'string' })
      .defaultNow()
      .$onUpdate(() => new Date().toISOString())
      .notNull(),
    yearFrom: integer('year_from').default(0).notNull(),
    titleFilmId: integer('title_film_id').notNull(),
    startDateCode: integer('start_date_code').notNull(),
    endDateCode: integer('end_date_code').notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.titleFilmId],
      foreignColumns: [films.id],
      name: 'collection_events_title_film_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('restrict'),
    foreignKey({
      columns: [table.collectionId],
      foreignColumns: [collections.id],
      name: 'collection_events_collection_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('restrict'),
  ],
);

export const filmsCollections = pgTable(
  'films_collections',
  {
    id: serial().primaryKey().notNull(),
    filmId: integer('film_id').notNull(),
    collectionId: integer('collection_id').notNull(),
    order: numeric('order', { mode: 'number' }).notNull(),
    createdAt: timestamp('created_at', { precision: 3, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { precision: 3, mode: 'string' })
      .defaultNow()
      .$onUpdate(() => new Date().toISOString())
      .notNull(),
  },
  (table) => [
    uniqueIndex('films_collections_film_id_collection_id_key').using(
      'btree',
      table.filmId.asc().nullsLast().op('int4_ops'),
      table.collectionId.asc().nullsLast().op('int4_ops'),
    ),
    foreignKey({
      columns: [table.filmId],
      foreignColumns: [films.id],
      name: 'films_collections_film_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    foreignKey({
      columns: [table.collectionId],
      foreignColumns: [collections.id],
      name: 'films_collections_collection_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
  ],
);

export const filmTrailers = pgTable(
  'film_trailers',
  {
    id: serial().primaryKey().notNull(),
    order: integer().notNull(),
    filmId: integer('film_id').notNull(),
    createdAt: timestamp('created_at', { precision: 3, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { precision: 3, mode: 'string' })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date().toISOString()),
    url: text().notNull(),
  },
  (table) => [
    uniqueIndex('film_trailers_film_id_url_key').using(
      'btree',
      table.filmId.asc().nullsLast().op('int4_ops'),
      table.url.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.filmId],
      foreignColumns: [films.id],
      name: 'film_trailers_film_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
  ],
);

export const countries = pgTable(
  'countries',
  {
    id: serial().primaryKey().notNull(),
    title: text().notNull(),
    createdAt: timestamp('created_at', { precision: 3, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { precision: 3, mode: 'string' })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date().toISOString()),
  },
  (table) => [
    uniqueIndex('countries_title_key').using('btree', table.title.asc().nullsLast().op('text_ops')),
  ],
);

export const filmAwardNominations = pgTable(
  'film_award_nominations',
  {
    id: serial().primaryKey().notNull(),
    awardId: integer('award_id').notNull(),
    nominationId: integer('nomination_id').notNull(),
    filmId: integer('film_id').notNull(),
    actorId: integer('actor_id'),
    createdAt: timestamp('created_at', { precision: 3, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { precision: 3, mode: 'string' })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date().toISOString()),
  },
  (table) => [
    uniqueIndex('film_award_nominations_award_id_film_id_nomination_id_key').using(
      'btree',
      table.awardId.asc().nullsLast().op('int4_ops'),
      table.filmId.asc().nullsLast().op('int4_ops'),
      table.nominationId.asc().nullsLast().op('int4_ops'),
    ),
    foreignKey({
      columns: [table.awardId],
      foreignColumns: [awards.id],
      name: 'film_award_nominations_award_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    foreignKey({
      columns: [table.nominationId],
      foreignColumns: [nominations.id],
      name: 'film_award_nominations_nomination_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    foreignKey({
      columns: [table.filmId],
      foreignColumns: [films.id],
      name: 'film_award_nominations_film_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    foreignKey({
      columns: [table.actorId],
      foreignColumns: [people.id],
      name: 'film_award_nominations_actor_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
  ],
);

export const filmsCountries = pgTable(
  'films_countries',
  {
    id: serial().primaryKey().notNull(),
    filmId: integer('film_id').notNull(),
    countryId: integer('country_id').notNull(),
    createdAt: timestamp('created_at', { precision: 3, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { precision: 3, mode: 'string' })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date().toISOString()),
  },
  (table) => [
    uniqueIndex('films_countries_film_id_country_id_key').using(
      'btree',
      table.filmId.asc().nullsLast().op('int4_ops'),
      table.countryId.asc().nullsLast().op('int4_ops'),
    ),
    foreignKey({
      columns: [table.filmId],
      foreignColumns: [films.id],
      name: 'films_countries_film_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    foreignKey({
      columns: [table.countryId],
      foreignColumns: [countries.id],
      name: 'films_countries_country_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
  ],
);

export const filmsGenres = pgTable(
  'films_genres',
  {
    id: serial().primaryKey().notNull(),
    filmId: integer('film_id').notNull(),
    genreId: integer('genre_id').notNull(),
    createdAt: timestamp('created_at', { precision: 3, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { precision: 3, mode: 'string' })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date().toISOString()),
  },
  (table) => [
    uniqueIndex('films_genres_film_id_genre_id_key').using(
      'btree',
      table.filmId.asc().nullsLast().op('int4_ops'),
      table.genreId.asc().nullsLast().op('int4_ops'),
    ),
    foreignKey({
      columns: [table.filmId],
      foreignColumns: [films.id],
      name: 'films_genres_film_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    foreignKey({
      columns: [table.genreId],
      foreignColumns: [genres.id],
      name: 'films_genres_genre_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
  ],
);

export const filmsStudios = pgTable(
  'films_studios',
  {
    id: serial().primaryKey().notNull(),
    filmId: integer('film_id').notNull(),
    studioId: integer('studio_id').notNull(),
    createdAt: timestamp('created_at', { precision: 3, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { precision: 3, mode: 'string' })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date().toISOString()),
  },
  (table) => [
    uniqueIndex('films_studios_film_id_studio_id_key').using(
      'btree',
      table.filmId.asc().nullsLast().op('int4_ops'),
      table.studioId.asc().nullsLast().op('int4_ops'),
    ),
    foreignKey({
      columns: [table.filmId],
      foreignColumns: [films.id],
      name: 'films_studios_film_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    foreignKey({
      columns: [table.studioId],
      foreignColumns: [studios.id],
      name: 'films_studios_studio_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
  ],
);

export const genres = pgTable(
  'genres',
  {
    id: serial().primaryKey().notNull(),
    title: text().notNull(),
    createdAt: timestamp('created_at', { precision: 3, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { precision: 3, mode: 'string' })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date().toISOString()),
  },
  (table) => [
    uniqueIndex('genres_title_key').using('btree', table.title.asc().nullsLast().op('text_ops')),
  ],
);

export const nominations = pgTable(
  'nominations',
  {
    id: serial().primaryKey().notNull(),
    title: text().notNull(),
    awardId: integer('award_id')
      .notNull()
      .references(() => awards.id),
    shouldIncludeActor: boolean('should_include_actor').default(false).notNull(),
    createdAt: timestamp('created_at', { precision: 3, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { precision: 3, mode: 'string' })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date().toISOString()),
  },
  (table) => [
    uniqueIndex('nominations_award_id_title_key').using(
      'btree',
      table.awardId.asc().nullsLast().op('int4_ops'),
      table.title.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.awardId],
      foreignColumns: [awards.id],
      name: 'nominations_award_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
  ],
);

export const seriesExtensions = pgTable(
  'series_extensions',
  {
    id: serial().primaryKey().notNull(),
    episodesTotal: integer('episodes_total').default(1).notNull(),
    seasonsTotal: integer('seasons_total').default(1).notNull(),
    filmId: integer('film_id').notNull(),
    createdAt: timestamp('created_at', { precision: 3, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { precision: 3, mode: 'string' })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date().toISOString()),
  },
  (table) => [
    uniqueIndex('series_extensions_film_id_key').using(
      'btree',
      table.filmId.asc().nullsLast().op('int4_ops'),
    ),
    foreignKey({
      columns: [table.filmId],
      foreignColumns: [films.id],
      name: 'series_extensions_film_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
  ],
);

export const studios = pgTable(
  'studios',
  {
    id: serial().primaryKey().notNull(),
    title: text().notNull(),
    createdAt: timestamp('created_at', { precision: 3, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { precision: 3, mode: 'string' })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date().toISOString()),
  },
  (table) => [
    uniqueIndex('studios_title_key').using('btree', table.title.asc().nullsLast().op('text_ops')),
  ],
);

export const users = pgTable(
  'users',
  {
    id: serial().primaryKey().notNull(),
    username: text().notNull(),
    password: text().notNull(),
    translationPreferences: jsonb().$type<{ from: string; to: string }>(),
    createdAt: timestamp('created_at', { precision: 3, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { precision: 3, mode: 'string' })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date().toISOString()),
  },
  (table) => [
    uniqueIndex('users_username_key').using(
      'btree',
      table.username.asc().nullsLast().op('text_ops'),
    ),
  ],
);

export const filmsPeople = pgTable(
  'films_people',
  {
    id: serial().primaryKey().notNull(),
    personId: integer('person_id').notNull(),
    filmId: integer('film_id').notNull(),
    role: personRole().notNull(),
    details: text(),
    createdAt: timestamp('created_at', { precision: 3, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { precision: 3, mode: 'string' })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date().toISOString()),
  },
  (table) => [
    foreignKey({
      columns: [table.personId],
      foreignColumns: [people.id],
      name: 'films_people_person_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    foreignKey({
      columns: [table.filmId],
      foreignColumns: [films.id],
      name: 'films_people_film_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
  ],
);

export const people = pgTable('people', {
  id: serial().primaryKey().notNull(),
  name: text().notNull(),
  createdAt: timestamp('created_at', { precision: 3, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { precision: 3, mode: 'string' })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date().toISOString()),
  selected: boolean().default(false).notNull(),
});

export const articles = pgTable('articles', {
  id: serial().primaryKey().notNull(),
  title: text().notNull(),
  content: text().notNull(),
  slug: text('slug').notNull().unique(),
  createdAt: timestamp('created_at', { precision: 3, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { precision: 3, mode: 'string' })
    .defaultNow()
    .$onUpdate(() => new Date().toISOString())
    .notNull(),
});

export const filmsDrafts = pgTable('films_drafts', {
  id: serial().primaryKey().notNull(),
  filmId: text('film_id').notNull(),
  content: jsonb().$type<Record<string, any>>().notNull(),
  createdAt: timestamp('created_at', { precision: 3, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { precision: 3, mode: 'string' })
    .defaultNow()
    .$onUpdate(() => new Date().toISOString())
    .notNull(),
});

export const usersSessions = pgTable(
  'users_sessions',
  {
    id: serial().primaryKey().notNull(),
    userId: integer('user_id').notNull(),
    sessionId: varchar('session_id').notNull(),
    refreshToken: varchar('refresh_token'),
    deviceInfo: jsonb('device_info').$type<DeviceInfo>(),
    lastActivityAt: timestamp('last_activity_at', {
      precision: 3,
      mode: 'string',
      withTimezone: true,
    }),
    createdAt: timestamp('created_at', { precision: 3, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { precision: 3, mode: 'string' })
      .defaultNow()
      .$onUpdate(() => new Date().toISOString())
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'users_sessions_user_id_fkey',
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
  ],
);

export const books = pgTable('books', {
  id: serial('id').primaryKey().notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  publicationYear: integer('publication_year').notNull(),
  pagesNumber: integer('pages_number').notNull(),
  rating: integer('rating').notNull().default(1),
  imagePath: text('image_path'),
  createdAt: timestamp('created_at', { precision: 3, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { precision: 3, mode: 'string' })
    .defaultNow()
    .$onUpdate(() => new Date().toISOString())
    .notNull(),
});

export const booksAuthors = pgTable(
  'books_authors',
  {
    id: serial('id').primaryKey().notNull(),
    bookId: integer('book_id')
      .notNull()
      .references(() => books.id),
    authorId: integer('author_id')
      .notNull()
      .references(() => people.id),
    createdAt: timestamp('created_at', { precision: 3, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { precision: 3, mode: 'string' })
      .defaultNow()
      .$onUpdate(() => new Date().toISOString())
      .notNull(),
  },
  (table) => [
    foreignKey({
      name: 'book_authors_book_id_fkey',
      columns: [table.bookId],
      foreignColumns: [books.id],
    }).onDelete('cascade'),
    foreignKey({
      name: 'book_authors_author_id_fkey',
      columns: [table.authorId],
      foreignColumns: [people.id],
    }).onDelete('cascade'),
    unique('book_author_unique').on(table.bookId, table.authorId),
  ],
);

export const booksGenres = pgTable(
  'books_genres',
  {
    id: serial('id').primaryKey().notNull(),
    bookId: integer('book_id')
      .notNull()
      .references(() => books.id),
    genreId: integer('genre_id')
      .notNull()
      .references(() => genres.id),
    createdAt: timestamp('created_at', { precision: 3, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { precision: 3, mode: 'string' })
      .defaultNow()
      .$onUpdate(() => new Date().toISOString())
      .notNull(),
  },
  (table) => [
    foreignKey({
      name: 'book_genres_book_id_fkey',
      columns: [table.bookId],
      foreignColumns: [books.id],
    }).onDelete('cascade'),
    foreignKey({
      name: 'book_genres_genre_id_fkey',
      columns: [table.genreId],
      foreignColumns: [genres.id],
    }).onDelete('cascade'),
    unique('book_genres_unique').on(table.bookId, table.genreId),
  ],
);

export const booksCollections = pgTable(
  'books_collections',
  {
    id: serial('id').primaryKey().notNull(),
    bookId: integer('book_id')
      .notNull()
      .references(() => books.id),
    collectionId: integer('collection_id')
      .notNull()
      .references(() => collections.id),
    createdAt: timestamp('created_at', { precision: 3, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { precision: 3, mode: 'string' })
      .defaultNow()
      .$onUpdate(() => new Date().toISOString())
      .notNull(),
  },
  (table) => [
    foreignKey({
      name: 'book_collections_book_id_fkey',
      columns: [table.bookId],
      foreignColumns: [books.id],
    }).onDelete('cascade'),
    foreignKey({
      name: 'book_collections_collection_id_fkey',
      columns: [table.collectionId],
      foreignColumns: [collections.id],
    }).onDelete('cascade'),
    unique('book_collections_unique').on(table.bookId, table.collectionId),
  ],
);

export const boardGames = pgTable('board_games', {
  id: serial('id').primaryKey().notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  mainGameId: integer('main_game_id'),
  gamesPlayed: integer('games_played').default(0),
  releasedYear: integer('released_year').notNull(),
  rating: integer('rating').notNull().default(1),
  imagePath: text('image_path'),
  createdAt: timestamp('created_at', { precision: 3, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { precision: 3, mode: 'string' })
    .defaultNow()
    .$onUpdate(() => new Date().toISOString())
    .notNull(),
});

export const boardGamesCreators = pgTable(
  'board_games_creators',
  {
    id: serial('id').primaryKey().notNull(),
    boardGameId: integer('board_game_id')
      .notNull()
      .references(() => boardGames.id),
    creatorId: integer('creator_id')
      .notNull()
      .references(() => people.id),
    createdAt: timestamp('created_at', { precision: 3, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { precision: 3, mode: 'string' })
      .defaultNow()
      .$onUpdate(() => new Date().toISOString())
      .notNull(),
  },
  (table) => [
    foreignKey({
      name: 'board_games_creators_board_game_id_fkey',
      columns: [table.boardGameId],
      foreignColumns: [boardGames.id],
    }).onDelete('cascade'),
    foreignKey({
      name: 'board_games_creators_creator_id_fkey',
      columns: [table.creatorId],
      foreignColumns: [people.id],
    }).onDelete('cascade'),
  ],
);

export type Film = typeof films.$inferSelect;
export type Genre = typeof genres.$inferSelect;
export type Person = typeof people.$inferSelect;
export type FilmPerson = typeof filmsPeople.$inferSelect;
export type FilmAwardNomination = typeof filmAwardNominations.$inferSelect;
export type Award = typeof awards.$inferSelect;
export type Nomination = typeof nominations.$inferSelect;
export type Studio = typeof studios.$inferSelect;
export type Country = typeof countries.$inferSelect;
export type Collection = typeof collections.$inferSelect;
export type SeriesExtension = typeof seriesExtensions.$inferSelect;
export type FilmTrailer = typeof filmTrailers.$inferSelect;
export type FilmCollection = typeof filmsCollections.$inferSelect;
export type FilmGenre = typeof filmsGenres.$inferSelect;
export type FilmStudio = typeof filmsStudios.$inferSelect;
export type FilmCountry = typeof filmsCountries.$inferSelect;
export type User = typeof users.$inferSelect;
export type UserSession = typeof usersSessions.$inferSelect;
export type Book = typeof books.$inferSelect;
export type BoardGame = typeof boardGames.$inferSelect;

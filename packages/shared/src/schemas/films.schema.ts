import { z } from 'zod';
import { DraftLevel, PersonRole, FilmType } from '../enums/index.js';
import { getArrayFromQuery, getBoolFromQuery, getListResponseSchema } from '../helpers/index.js';
import { AwardResponseSchema, NominationResponseSchema } from './awards.schema.js';
import { CollectionCurrentEventsListResponseSchema } from './collection-events.schema.js';
import { CollectionResponseSchema } from './collections.schema.js';
import { CountryResponseSchema } from './countries.schema.js';
import { GenreResponseSchema } from './genres.schema.js';
import { PersonResponseSchema } from './people.schema.js';
import { StudioResponseSchema } from './studios.schema.js';
import { buildListQueryParamsSchema } from '../helpers/build-list-query-params-schema.js';

const DateStringSchema = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, 'Date must be in YYYY-MM-DD format');

const SeriesExtensionSchema = z.object({
  episodesTotal: z.coerce.number(),
  seasonsTotal: z.coerce.number(),
});

export const CreateFilmInputSchema = z.object({
  title: z.string().nonempty(),
  type: z.enum(FilmType),
  rating: z.coerce.number().min(1).max(3),
  imagePath: z.string().optional().nullable(),
  genres: z.array(z.number()),
  studios: z.array(z.number()),
  countries: z.array(z.number()),
  collections: z.array(
    z.object({
      collectionId: z.number(),
      order: z.number().min(0.1, {
        error: 'Order is required for the collection',
      }),
    }),
  ),
  duration: z.coerce.number(),
  releaseDate: DateStringSchema.nullable(),
  budget: z.coerce.number().max(900_000_000),
  boxOffice: z.coerce.number().max(4_000_000_000),
  description: z.string().nullable(),
  castAndCrew: z.array(
    z.object({
      role: z.enum(PersonRole),
      people: z
        .array(
          z.object({
            personId: z.coerce.number().min(1, 'Person cannot be empty'),
            details: z.string().nullable(),
          }),
        )
        .min(1, 'Cast and Crew should contain people'),
    }),
  ),
  awards: z.array(
    z.object({
      awardId: z.number().min(1, 'Award cannot be empty'),
      nominations: z
        .array(
          z.object({
            nominationId: z.number().min(1, 'Nomination cannot be empty'),
            actorId: z.number().nullable(),
          }),
        )
        .min(1, 'Award should contain nominations'),
    }),
  ),
  trailers: z.array(
    z.object({
      order: z.number(),
      url: z.string(),
    }),
  ),
  tempDraftId: z.coerce.number().optional(),
  seriesExtension: SeriesExtensionSchema.nullable(),
  draft: z.boolean(),
});

export const GetFilmsListQuerySchema = buildListQueryParamsSchema(
  z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    year: z.coerce.number().optional(),
    collectionId: z.coerce.number().optional(),
    duration: z.coerce.number().optional(),
    rating: z.coerce.number().optional(),
    seasonsTotal: z.coerce.number().optional(),
    episodesTotal: z.coerce.number().optional(),
    personId: z.coerce.number().optional(),
    awardId: z.coerce.number().optional(),
    budget: z.coerce.number().optional(),
    boxOffice: z.coerce.number().optional(),
    type: z.enum(FilmType).optional(),
    personRole: z.enum(PersonRole).optional(),
    genreIds: getArrayFromQuery(z.coerce.number()).optional(),
    studioIds: getArrayFromQuery(z.coerce.number()).optional(),
    countryIds: getArrayFromQuery(z.coerce.number()).optional(),
    releasedThisDay: getBoolFromQuery.optional(),
    runtimeRange: getArrayFromQuery(z.coerce.number()).optional(),
  }),
);

export const GetAdminListQuerySchema = GetFilmsListQuerySchema.extend({
  draftLevels: getArrayFromQuery(z.enum(DraftLevel)).optional(),
  noDescription: getBoolFromQuery,
  noCrewOrCast: getBoolFromQuery,
  noBoxOffice: getBoolFromQuery,
  noTrailers: getBoolFromQuery,
  incompleteBoxOffice: getBoolFromQuery,
});

export const SearchFilmsQuerySchema = z.object({
  q: z.string().nullable().optional(),
});

export const GetFilmOptionsQuerySchema = z.object({
  q: z.string().optional(),
  selected: getArrayFromQuery(z.coerce.number()).optional(),
});

const TrailerSchema = z.object({
  id: z.coerce.number(),
  filmId: z.coerce.number(),
  url: z.string(),
  order: z.coerce.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const FilmResponseSchema = z.object({
  id: z.coerce.number(),
  title: z.string(),
  imagePath: z.string().nullable(),
  type: z.enum(FilmType),
  duration: z.coerce.number(),
  description: z.string().nullable(),
  rating: z.coerce.number(),
  releaseDate: z.string().nullable(),
  budget: z.coerce.number().nullable(),
  boxOffice: z.coerce.number().nullable(),
  genres: z.array(GenreResponseSchema.omit({ createdAt: true, updatedAt: true })),
  studios: z.array(StudioResponseSchema.omit({ createdAt: true, updatedAt: true })),
  countries: z.array(CountryResponseSchema.omit({ createdAt: true, updatedAt: true })),
  collections: z.array(CollectionResponseSchema.pick({ id: true, title: true, category: true })),
  trailers: z.array(TrailerSchema),
  awards: z.array(
    z.object({
      award: AwardResponseSchema.pick({ id: true, title: true }),
      nominations: z.array(
        z.object({
          title: z.string(),
          person: PersonResponseSchema.pick({ id: true, name: true }).nullable(),
        }),
      ),
    }),
  ),
  seriesExtension: z
    .object({
      episodesTotal: z.coerce.number(),
      seasonsTotal: z.coerce.number(),
    })
    .nullable(),
  castAndCrew: z.array(
    z.object({
      role: z.enum(PersonRole),
      people: z.array(
        z.object({
          id: z.coerce.number(),
          name: z.string(),
          details: z.string().trim().nullable(),
        }),
      ),
    }),
  ),
});

export const FilmsListResponseSchema = getListResponseSchema(
  z.array(
    FilmResponseSchema.pick({ id: true, title: true, imagePath: true, releaseDate: true }).extend({
      upcoming: z.boolean(),
      inDays: z.number().nullable(),
      releasedYears: z.number().nullable(),
      sequenceNum: z.number().optional(),
    }),
  ),
).extend({
  events: CollectionCurrentEventsListResponseSchema,
  allFilmsCount: z.number(),
  anniversaryImagePath: z.string().nullable(),
  additionalInfo: z
    .object({
      type: z.enum(['crew']),
      data: z.object({
        role: z.string(),
        name: z.string(),
      }),
    })
    .nullable()
    .or(
      z
        .object({
          type: z.enum(['collection']),
          data: CollectionResponseSchema,
        })
        .nullable(),
    )
    .or(
      z
        .object({
          type: z.enum(['award']),
          data: AwardResponseSchema.omit({ createdAt: true, updatedAt: true }),
        })
        .nullable(),
    ),
});

export const FilmsSearchResponseSchema = z.array(
  FilmResponseSchema.pick({
    id: true,
    title: true,
    imagePath: true,
    releaseDate: true,
    genres: true,
  }),
);

export const FilmsAdminListResponseSchema = z.object({
  list: z.array(
    FilmResponseSchema.pick({ id: true, title: true, imagePath: true }).extend({
      draft: z.boolean(),
    }),
  ),
  total: z.number(),
  pageLimit: z.number(),
});

export const UpdateFilmInputSchema = CreateFilmInputSchema.partial()
  .omit({
    seriesExtension: true,
  })
  .extend({
    seriesExtension: SeriesExtensionSchema.partial().nullable().optional(),
  });

export const GetCompleteDataListQuerySchema = z.object({
  newestOnly: getBoolFromQuery.optional(),
  intervalDays: z.coerce.number().optional(),
});

export const CompleteDataListItemSchema = z.object({
  ...FilmResponseSchema.pick({
    id: true,
    title: true,
    releaseDate: true,
    type: true,
    duration: true,
    budget: true,
    boxOffice: true,
    description: true,
    imagePath: true,
  }).shape,
  genres: z.array(GenreResponseSchema.pick({ title: true, id: true })),
  countries: z.array(CountryResponseSchema.pick({ title: true, id: true })),
  studios: z.array(StudioResponseSchema.pick({ title: true, id: true })),
  trailers: z.array(TrailerSchema.pick({ url: true, order: true, id: true })),
  awards: z.array(
    z.object({
      id: z.number(),
      title: z.string(),
      nominations: z.array(NominationResponseSchema.pick({ title: true, id: true })),
    }),
  ),
  castAndCrew: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      role: z.enum(PersonRole),
      details: z.string().nullable(),
    }),
  ),
  collections: z.array(
    z.object({
      id: z.number(),
      title: z.string(),
      order: z.number(),
    }),
  ),
  seriesExtension: z
    .object({
      id: z.number(),
      episodesTotal: z.number(),
      seasonsTotal: z.number(),
    })
    .optional(),
});

export const CompleteDataResponseSchema = z.object({
  list: z.array(CompleteDataListItemSchema),
  baseData: z.object({
    genres: z.array(GenreResponseSchema.pick({ title: true, id: true })),
    countries: z.array(CountryResponseSchema.pick({ title: true, id: true })),
    studios: z.array(StudioResponseSchema.pick({ title: true, id: true })),
    people: z.array(PersonResponseSchema.pick({ name: true, id: true })),
    collections: z.array(CollectionResponseSchema.pick({ title: true, id: true, category: true })),
    awards: z.array(
      z.object({
        ...AwardResponseSchema.pick({ id: true, title: true }).shape,
        nominations: z.array(NominationResponseSchema.omit({ createdAt: true, updatedAt: true })),
      }),
    ),
  }),
});

export const TranslateDescriptionInputSchema = z.object({
  text: z.string(),
});

export const TranslateDescriptionResponseSchema = z.object({
  translatedText: z.string(),
});

export const CreateFilmDraftInputSchema = z.object({
  content: z.any(),
});

export const FilmDraftInputResponse = z.object({
  id: z.number(),
  filmId: z.string(),
  content: z.any(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const FilmDraftFilmIdParamsSchema = z.object({
  filmId: z.string(),
});

export const FilmTrailersResponseSchema = z.object({
  trailers: z.array(
    z.object({
      url: z.string(),
    }),
  ),
});

const StatsEnum = z.enum(['genres', 'countries', 'collections', 'studios', 'types']);

export const FilmStatsResponseSchema = z.object({
  stats: z.record(StatsEnum, z.array(z.object({ title: z.string(), value: z.number() }))),
  filmsTotal: z.number(),
});

export const FilmsByCollectionResponseSchema = z.array(
  FilmResponseSchema.pick({ id: true, title: true, imagePath: true }).extend({ order: z.number() }),
);

export const DeleteFilmDrafts = z.object({
  ok: z.boolean(),
});

export const GetFilmByCollectionNameSchema = z.object({ title: z.string() });

export const GetFilmByCollectionNameResponse = FilmResponseSchema.pick({
  id: true,
  title: true,
  imagePath: true,
}).extend({ order: z.number() });

export type GetFilmsListQuery = z.infer<typeof GetFilmsListQuerySchema>;
export type SearchFilmsQuery = z.infer<typeof SearchFilmsQuerySchema>;
export type GetFilmOptionsQuery = z.infer<typeof GetFilmOptionsQuerySchema>;
export type GetCompleteDataListQuery = z.infer<typeof GetCompleteDataListQuerySchema>;
export type CreateFilmInput = z.infer<typeof CreateFilmInputSchema>;
export type UpdateFilmInput = z.infer<typeof UpdateFilmInputSchema>;
export type CompleteDataListItem = z.infer<typeof CompleteDataListItemSchema>;
export type CompleteDataResponse = z.infer<typeof CompleteDataResponseSchema>;
export type TranslateDescriptionInput = z.infer<typeof TranslateDescriptionInputSchema>;
export type CreateFilmDraftInput = z.infer<typeof CreateFilmDraftInputSchema>;
export type FilmDraftResponse = z.infer<typeof FilmDraftInputResponse>;
export type FilmDraftFilmIdParams = z.infer<typeof FilmDraftFilmIdParamsSchema>;
export type GetAdminListQueryParams = z.infer<typeof GetAdminListQuerySchema>;
export type FilmStatsResponse = z.infer<typeof FilmStatsResponseSchema>;

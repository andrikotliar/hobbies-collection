import {
  type GetFilmsListQuery,
  type GetFilmOptionsQuery,
  convertEnumValueToLabel,
  type CreateFilmInput,
  type UpdateFilmInput,
  type GetCompleteDataListQuery,
  type CompleteDataResponse,
  type TranslateDescriptionInput,
  type CreateFilmDraftInput,
  type FilmDraftResponse,
  type GetAdminListQueryParams,
  DraftLevel,
  enumValues,
  PAGE_LIMITS,
  type FilmStatsResponse,
} from '@hobbies-collection/shared';
import { mapFilmDetails, mapAdminFilmDetails, mapCompleteDataList } from './helpers/index.js';
import type { FilmCollection } from '~/database/schema.js';
import type { Timestamps } from '~/modules/films/types.js';
import type { Deps } from '~/shared/types/deps.js';
import { throwIfNotFound } from '~/shared/helpers/throw-if-not-found.js';
import { BadRequestException } from '~/shared/exceptions/bad-request.js';

type GenericOption = {
  id: number;
  title: string;
  updatedAt: string;
};

const statBlocks = ['genres', 'collections', 'countries', 'studios', 'types'] as const;

export class FilmsService {
  private readonly basePostersUrl: string;

  constructor(
    private readonly deps: Deps<
      | 'filmsRepository'
      | 'peopleService'
      | 'awardsService'
      | 'collectionsService'
      | 'collectionEventsService'
      | 'genresService'
      | 'countriesService'
      | 'studiosService'
      | 'aiService'
      | 'usersService'
      | 'inMemoryCacheService'
      | 'storageService'
    >,
  ) {
    deps.inMemoryCacheService.setDefaultValue('filmsCount', 0);
    deps.inMemoryCacheService.setDefaultValue('anniversary', { film: null, date: null });
    deps.inMemoryCacheService.setDefaultValue('statistic', null);

    this.basePostersUrl = deps.storageService.getBaseStorageUrl();
  }

  private getAllFilmsCount() {
    return this.deps.inMemoryCacheService.getOrSet('filmsCount', () =>
      this.deps.filmsRepository.countPublishedFilms(),
    );
  }

  private async getAnniversaryFilm() {
    const date = new Date();
    const dateParams = `${date.getDate()}${date.getMonth()}${date.getFullYear()}`;

    const anniversaryCache = this.deps.inMemoryCacheService.get('anniversary');

    if (anniversaryCache.date === dateParams) {
      return anniversaryCache.film;
    }

    const list = await this.deps.filmsRepository.getAnniversaries();

    const film = list[0] ?? null;

    this.deps.inMemoryCacheService.set('anniversary', {
      date: dateParams,
      film,
    });

    return film;
  }

  async getFilteredFilms(queries: GetFilmsListQuery) {
    const data = await this.deps.filmsRepository.findAndCount({
      ...queries,
      order: queries.order ?? 'desc',
      orderKey: queries.collectionId ? 'collectionOrder' : (queries.orderKey ?? 'releaseDate'),
      draftLevels: [DraftLevel.PUBLISHED, DraftLevel.UPCOMING],
    });

    const additionalInfo = await this.populateAdditionalData(queries);
    const allFilmsCount = await this.getAllFilmsCount();

    const todayCode = this.getDateCode(new Date());

    const mappedList = data.list.map((film) => ({
      ...film,
      imagePath: film.imagePath ? this.basePostersUrl + film.imagePath : null,
      upcoming: film.draft,
      inDays: film.draft && film.releaseDate ? this.getDaysDiffFromToday(film.releaseDate) : null,
      releasedYears:
        film.releaseDate && todayCode === this.getDateCode(new Date(film.releaseDate))
          ? this.countReleasedYear(film.releaseDate)
          : null,
    }));

    const events = await this.deps.collectionEventsService.findTodayEvents();
    const anniversary = await this.getAnniversaryFilm();

    const params = {
      list: mappedList,
      total: data.total,
      additionalInfo,
      events,
      pageLimit: PAGE_LIMITS.filmsList,
      anniversaryImagePath: anniversary?.imagePath ?? null,
      allFilmsCount,
    };

    if (queries.collectionId) {
      const collectionParams = await this.deps.filmsRepository.getCollectionOrder(
        queries.collectionId,
      );

      const values = new Map();

      collectionParams.forEach((collection) => {
        values.set(collection.filmId, collection.order);
      });

      const filmsListWithCollectionOrder = mappedList.map((film) => {
        return {
          ...film,
          sequenceNum: values.get(film.id) ?? 0,
        };
      });

      params.list = filmsListWithCollectionOrder.toSorted((a, b) => {
        return a.sequenceNum - b.sequenceNum;
      });
    }

    return params;
  }

  async getFilmDetails(id: number, level: 'admin' | 'public' = 'public') {
    const film = await this.deps.filmsRepository.findById(id, level);

    if (!film) {
      return null;
    }

    const mappedFilm = mapFilmDetails(film, this.basePostersUrl);

    return mappedFilm;
  }

  async searchFilm(searchString?: string | null) {
    if (!searchString) {
      return [];
    }
    const films = await this.deps.filmsRepository.searchByTitle(searchString);

    return films.map((film) => ({
      ...film,
      imagePath: film.imagePath ? this.basePostersUrl + film.imagePath : null,
      genres: film.genres.map((g) => g.genre),
    }));
  }

  async getAdminList(queries: GetAdminListQueryParams) {
    const data = await this.deps.filmsRepository.findAndCount(
      {
        ...queries,
        orderKey: queries.orderKey ?? 'updatedAt',
        order: queries.order ?? 'desc',
        draftLevels: queries.draftLevels ?? enumValues(DraftLevel),
      },
      'admin',
    );

    return {
      ...data,
      pageLimit: PAGE_LIMITS.filmsList,
    };
  }

  async getEditableFilm(id: number) {
    const film = await throwIfNotFound(this.deps.filmsRepository.getEditableFilm(id));

    return mapAdminFilmDetails(film, this.basePostersUrl);
  }

  async createFilm(input: CreateFilmInput) {
    const { tempDraftId, ...payload } = input;

    const { filmId } = await this.deps.filmsRepository.create(payload);

    this.deps.inMemoryCacheService.resetValue('filmsCount');
    this.deps.inMemoryCacheService.resetValue('statistic');

    if (tempDraftId) {
      await this.deps.filmsRepository.deleteDraft(tempDraftId);
    }

    return await this.getFilmDetails(filmId, 'admin');
  }

  async getFilmsByCollection(collectionId: number) {
    const films = await this.deps.filmsRepository.getByCollectionId(collectionId);

    return films;
  }

  private async populateAdditionalData(query: GetFilmsListQuery) {
    const { personId, personRole, collectionId, awardId } = query;

    if (personId && personRole) {
      const crewMember = await this.deps.peopleService.getPersonById(personId);

      if (!crewMember) {
        return null;
      }

      return {
        type: 'crew' as const,
        data: {
          role: convertEnumValueToLabel(personRole),
          name: crewMember.name,
        },
      };
    }

    if (collectionId) {
      const collection = await this.deps.collectionsService.getCollectionById(collectionId);

      if (!collection) {
        return null;
      }

      return {
        type: 'collection' as const,
        data: collection,
      };
    }

    if (awardId) {
      const award = await this.deps.awardsService.getBaseAwardData(awardId);

      if (!award) {
        return null;
      }

      return {
        type: 'award' as const,
        data: award,
      };
    }

    return null;
  }

  async getFilmOptions(queries: GetFilmOptionsQuery) {
    const films = await this.deps.filmsRepository.getFilmsListByQuery(queries);

    return films.map((film) => ({
      label: film.title,
      value: film.id,
    }));
  }

  async deleteFilm(id: number) {
    await this.deps.filmsRepository.softDelete(id, new Date().toISOString());

    return { id };
  }

  async updateFilm(filmId: number, input: UpdateFilmInput) {
    await this.deps.filmsRepository.updateFilm(filmId, input);
    await this.deps.filmsRepository.deleteAllDraftsOfFilm(filmId.toString());
    this.deps.inMemoryCacheService.resetValue('statistic');
    return this.getFilmDetails(filmId, 'admin');
  }

  async getCompleteData(queries: GetCompleteDataListQuery): Promise<CompleteDataResponse> {
    const films = await this.deps.filmsRepository.getCompleteData(queries);
    const genres = await this.deps.genresService.getBaseListData({});
    const countries = await this.deps.countriesService.getBaseDataList({});
    const studios = await this.deps.studiosService.getBaseDataList({});
    const awards = await this.deps.awardsService.getAwardsWithNominations();
    const people = await this.deps.peopleService.getAll();
    const collections = await this.deps.collectionsService.getChapterRelatedCollections();

    return {
      list: mapCompleteDataList(films),
      baseData: {
        genres: this.listOptionsToDto(this.getValidatedOptions(genres.list, queries.newestOnly)),
        countries: this.listOptionsToDto(
          this.getValidatedOptions(countries.list, queries.newestOnly),
        ),
        studios: this.listOptionsToDto(this.getValidatedOptions(studios.list, queries.newestOnly)),
        people: this.getValidatedOptions(people, queries.newestOnly).map((person) => ({
          id: person.id,
          name: person.name,
        })),
        collections: this.getValidatedOptions(collections, queries.newestOnly),
        awards: this.getValidatedOptions(awards, queries.newestOnly).map((award) => ({
          id: award.id,
          title: award.title,
          nominations: award.nominations.map((nomination) => ({
            id: nomination.id,
            title: nomination.title,
            shouldIncludeActor: nomination.shouldIncludeActor,
          })),
        })),
      },
    };
  }

  async translateDescription(userId: number, input: TranslateDescriptionInput) {
    const userPreferences = await this.deps.usersService.getUserTranslationPreferences(userId);

    if (!userPreferences.translationPreferences) {
      throw new BadRequestException({
        message: 'Translation preferences is not set, update them in the user settings',
      });
    }

    return this.deps.aiService.translateToLangPrompt(
      input.text,
      userPreferences.translationPreferences,
    );
  }

  createDraft(filmId: string, input: CreateFilmDraftInput): Promise<FilmDraftResponse> {
    return throwIfNotFound(this.deps.filmsRepository.createDraft(filmId, input));
  }

  updateDraft(id: number, input: CreateFilmDraftInput): Promise<FilmDraftResponse> {
    return throwIfNotFound(this.deps.filmsRepository.updateDraft(id, input.content));
  }

  getDrafts(filmId: string): Promise<FilmDraftResponse[]> {
    return this.deps.filmsRepository.getDrafts(filmId);
  }

  deleteDraft(id: number) {
    return this.deps.filmsRepository.deleteDraft(id);
  }

  getFilmTrailers(id: number) {
    return this.deps.filmsRepository.getTrailersByFilmId(id);
  }

  private async aggregate(key: (typeof statBlocks)[number]) {
    switch (key) {
      case 'collections':
        return await this.deps.filmsRepository.aggregateFilmCollections();
      case 'genres':
        return await this.deps.filmsRepository.aggregateFilmGenres();
      case 'countries':
        return await this.deps.filmsRepository.aggregateFilmCountries();
      case 'studios':
        return await this.deps.filmsRepository.aggregateFilmStudios();
      case 'types':
        return (await this.deps.filmsRepository.aggregateFilmTypes()).map((item) => ({
          ...item,
          title: convertEnumValueToLabel(item.title),
        }));
      default:
        throw new BadRequestException({ message: 'Unknown stats type' });
    }
  }

  async getStats(): Promise<FilmStatsResponse> {
    const cachedValue = this.deps.inMemoryCacheService.get('statistic');
    const filmsTotal = await this.getAllFilmsCount();

    if (cachedValue) {
      return { stats: cachedValue, filmsTotal };
    }

    const result: FilmStatsResponse['stats'] = {
      types: [],
      countries: [],
      collections: [],
      studios: [],
      genres: [],
    };

    for await (const block of statBlocks) {
      const stats = await this.aggregate(block);

      result[block] = stats;
    }

    this.deps.inMemoryCacheService.set('statistic', result);

    return { stats: result, filmsTotal };
  }

  async deleteAllFilmDrafts(filmId: string) {
    return this.deps.filmsRepository.deleteAllDraftsOfFilm(filmId);
  }

  linkCollectionToFilms(input: Omit<FilmCollection, Timestamps | 'id'>[]) {
    return this.deps.filmsRepository.linkFilmToCollection(input);
  }

  unlinkCollection(collectionId: number) {
    return this.deps.filmsRepository.unlinkCollection(collectionId);
  }

  getFilmByCollectionName(title: string) {
    return throwIfNotFound(this.deps.filmsRepository.getFilmByCollectionTitleAndDay(title));
  }

  private getValidatedOptions<T extends { updatedAt: string }>(
    options: T[],
    newestOnly?: boolean,
  ): T[] {
    if (!newestOnly) {
      return options;
    }

    const now = new Date();
    const cutoff = new Date(now);
    cutoff.setDate(now.getDate() - 7);

    const updatedOptions = options.filter((item) => {
      const updatedDate = new Date(item.updatedAt);

      if (isNaN(updatedDate.getTime())) {
        return false;
      }

      return updatedDate >= cutoff && updatedDate <= now;
    });

    if (!updatedOptions.length) {
      return [];
    }

    return options;
  }

  private listOptionsToDto<T extends GenericOption>(
    options: T[],
  ): Pick<GenericOption, 'id' | 'title'>[] {
    return options.map((option) => ({
      id: option.id,
      title: option.title,
    }));
  }

  private getDaysDiffFromToday(dateString: string) {
    const now = new Date();
    const target = new Date(dateString);

    // Reset time to midnight for accurate "day" diff
    now.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    const diffMs = target.getTime() - now.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    return diffDays;
  }

  private getDateCode(date: Date) {
    const day = date.getDate();
    const month = date.getMonth();

    return `${day}${month}`;
  }

  private countReleasedYear(dateString: string) {
    const releaseYear = new Date(dateString).getFullYear();
    const nowYear = new Date().getFullYear();

    return nowYear - releaseYear;
  }
}

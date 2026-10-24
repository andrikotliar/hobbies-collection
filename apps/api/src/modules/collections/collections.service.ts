import {
  PAGE_LIMITS,
  type CollectionsListResponse,
  type CommonListQueryParams,
  type CreateCollectionInput,
  type UpdateCollectionInput,
} from '@hobbies-collection/shared';
import { buildListOptions } from '~/shared/helpers/build-list-options.js';
import { throwIfNotFound } from '~/shared/helpers/throw-if-not-found.js';
import type { Deps } from '~/shared/types/deps.js';

export class CollectionsService {
  constructor(private readonly deps: Deps<'collectionsRepository' | 'filmsService'>) {}

  async getCollectionById(id: number) {
    return this.deps.collectionsRepository.getCollectionById(id);
  }

  async getAllCollections() {
    const collections = await this.deps.collectionsRepository.getAll();

    return buildListOptions(collections);
  }

  async getGeneralDataList(queries: CommonListQueryParams): Promise<CollectionsListResponse> {
    const { list, total } = await this.deps.collectionsRepository.getList(queries);

    return { list, total, pageLimit: PAGE_LIMITS.default };
  }

  async createCollection(input: CreateCollectionInput) {
    const collection = await throwIfNotFound(this.deps.collectionsRepository.create(input));

    if (input.films.length) {
      await this.deps.filmsService.linkCollectionToFilms(
        input.films.map((film) => ({
          filmId: film.filmId,
          order: film.order,
          collectionId: collection.id,
        })),
      );
    }

    return collection;
  }

  deleteCollection(id: number) {
    return this.deps.collectionsRepository.delete(id);
  }

  async updateCollection(id: number, input: UpdateCollectionInput) {
    const collection = await this.deps.collectionsRepository.update(id, input);

    if (input.films) {
      await this.deps.filmsService.unlinkCollection(id);

      if (input.films.length) {
        await this.deps.filmsService.linkCollectionToFilms(
          input.films.map((film) => ({
            filmId: film.filmId,
            order: film.order,
            collectionId: collection.id,
          })),
        );
      }
    }

    return collection;
  }

  async getOptionsByHobbyId(_hobbyId: number) {
    return buildListOptions([]);
  }
}

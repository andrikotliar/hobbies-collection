import type {
  BookInput,
  BookListResponse,
  BookResponse,
  BooksListQueryParams,
  BookUpdateInput,
} from '@hobbies-collection/shared';
import { throwIfNotFound } from '~/shared/helpers/throw-if-not-found.js';
import type { Deps } from '~/shared/types/deps.js';

export class BooksService {
  constructor(private readonly deps: Deps<'booksRepository'>) {}

  async getBook(id: number): Promise<BookResponse> {
    const data = await throwIfNotFound(this.deps.booksRepository.get(id));

    return {
      ...data,
      collections: data.collections.map((collection) => collection.collectionId),
      authors: data.authors.map((item) => item.author),
      genres: data.genres.map((item) => item.genre),
    };
  }

  async getList(queries: BooksListQueryParams): Promise<BookListResponse> {
    return this.deps.booksRepository.list(queries);
  }

  async deleteBook(id: number): Promise<void> {
    await this.deps.booksRepository.delete(id);
  }

  async createBook(input: BookInput) {
    return this.deps.booksRepository.create(input);
  }

  async updateBook(id: number, input: BookUpdateInput) {
    return this.deps.booksRepository.update(id, input);
  }
}

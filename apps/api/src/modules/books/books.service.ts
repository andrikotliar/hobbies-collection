import {
  BookReadStatus,
  PAGE_LIMITS,
  type BookAdminListResponse,
  type BookInput,
  type BookListResponse,
  type BooksSearchResponse,
  type BookResponse,
  type BooksAdminListQueryParams,
  type BooksListQueryParams,
  type BookUpdateInput,
} from '@hobbies-collection/shared';
import type { Book } from '~/database/schema.js';
import { buildListOptions } from '~/shared/helpers/build-list-options.js';
import { throwIfNotFound } from '~/shared/helpers/throw-if-not-found.js';
import type { Deps } from '~/shared/types/deps.js';

export class BooksService {
  constructor(private readonly deps: Deps<'booksRepository' | 'storageService'>) {}

  async getBook(id: number): Promise<BookResponse> {
    const data = await throwIfNotFound(this.deps.booksRepository.get(id));

    return {
      ...data,
      imagePath: this.deps.storageService.constructFullObjectPath(data.imagePath),
      authors: data.authors.map((item) => item.author),
      genres: data.genres.map((item) => item.genre),
    };
  }

  async getList(queries: BooksListQueryParams): Promise<BookListResponse> {
    return this.deps.booksRepository.list(queries);
  }

  async getAdminList(queries: BooksAdminListQueryParams): Promise<BookAdminListResponse> {
    const { status, ...otherQueries } = queries;

    const list = await this.deps.booksRepository.list(
      otherQueries,
      status ? [status] : [BookReadStatus.PLANNED, BookReadStatus.READ],
    );

    const total = await this.deps.booksRepository.count();

    return { list, pageLimit: PAGE_LIMITS.booksList, total };
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

  async getEditableBook(id: number): Promise<BookInput> {
    const book = await throwIfNotFound(this.deps.booksRepository.getEditableBook(id));

    return {
      ...book,
      imagePath: this.deps.storageService.constructFullObjectPath(book.imagePath),
      authors: book.authors.map((item) => item.authorId),
      genres: book.genres.map((item) => item.genreId),
    };
  }

  async getNextBookOrderNumber(title?: string): Promise<BooksSearchResponse> {
    if (!title) {
      return [];
    }
    const data = await this.deps.booksRepository.findOrder(title);

    if (!data.targetBook) {
      return [{ value: 1, label: '1' }];
    }

    if (!data.nextBook) {
      const nextOrderNumber = data.targetBook.readingOrder + 1;

      return [{ value: nextOrderNumber, label: nextOrderNumber.toString() }];
    }

    const nextOrderNumber = (data.nextBook.readingOrder + data.targetBook.readingOrder) / 2;

    return [{ value: nextOrderNumber, label: nextOrderNumber.toString() }];
  }

  async search(title?: string, selected?: number[]): Promise<BooksSearchResponse> {
    if (!title && !selected) {
      return [];
    }

    const result: Pick<Book, 'id' | 'title'>[] = [];

    if (title) {
      const books = await this.deps.booksRepository.search(title);

      result.push(...books);
    }

    if (selected) {
      const selectedBooks = await this.deps.booksRepository.getByIds(selected);

      result.push(...selectedBooks);
    }

    return buildListOptions(result);
  }

  async getSeries(id: number) {
    const data = await this.deps.booksRepository.getSeries(id);
    return data.map((book) => ({
      ...book,
      imagePath: this.deps.storageService.constructFullObjectPath(book.imagePath),
    }));
  }
}

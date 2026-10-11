import {
  BookReadStatus,
  getSkipValue,
  PAGE_LIMITS,
  type BookInput,
  type BooksListQueryParams,
  type BookUpdateInput,
  type SortingOrder,
  type TBookReadStatus,
} from '@hobbies-collection/shared';
import { and, asc, eq, gt, ilike, inArray, or, sql } from 'drizzle-orm';
import { books, booksAuthors, booksGenres, type Book } from '~/database/schema.js';
import { mapBooksListFilters } from '~/modules/books/helpers/index.js';
import { getDirectionFn } from '~/shared/helpers/get-direction-fn.js';
import { sqlSearchQuery } from '~/shared/helpers/sql-search-query.js';
import { updateTableRelations } from '~/shared/helpers/update-table-relations.js';
import type { Deps } from '~/shared/types/deps.js';

export class BooksRepository {
  constructor(private readonly deps: Deps<'db'>) {}

  list(queryParams?: BooksListQueryParams, status: TBookReadStatus[] = [BookReadStatus.READ]) {
    const sorting = this.mapSorting(queryParams?.orderKey, queryParams?.order);
    const filters = mapBooksListFilters(this.deps.db, queryParams);
    return this.deps.db
      .select({
        id: books.id,
        title: books.title,
        imagePath: books.imagePath,
        publicationYear: books.publicationYear,
      })
      .from(books)
      .where(and(inArray(books.status, status), ...filters))
      .limit(PAGE_LIMITS.booksList)
      .orderBy(sorting)
      .offset(getSkipValue('booksList', queryParams?.pageIndex));
  }

  count() {
    return this.deps.db.$count(books);
  }

  get(id: number) {
    return this.deps.db.query.books.findFirst({
      where: and(eq(books.id, id), eq(books.status, BookReadStatus.READ)),
      columns: {
        id: true,
        title: true,
        description: true,
        publicationYear: true,
        pagesNumber: true,
        rating: true,
        imagePath: true,
      },
      with: {
        authors: {
          with: {
            author: true,
          },
        },
        genres: {
          with: {
            genre: true,
          },
        },
      },
    });
  }

  create(input: BookInput) {
    return this.deps.db.transaction(async (tr) => {
      const { authors, genres, ...bookInput } = input;
      const [newBook] = await tr.insert(books).values(bookInput).returning();

      const bookId = newBook.id;

      if (authors.length) {
        await tr.insert(booksAuthors).values(authors.map((authorId) => ({ authorId, bookId })));
      }

      if (genres.length) {
        await tr.insert(booksGenres).values(genres.map((genreId) => ({ genreId, bookId })));
      }

      return newBook;
    });
  }

  update(bookId: number, input: BookUpdateInput) {
    return this.deps.db.transaction(async (transaction) => {
      const { authors, genres, ...bookParams } = input;

      const now = new Date();

      const [updatedBook] = await transaction
        .update(books)
        .set({ ...bookParams, updatedAt: now.toISOString() })
        .where(eq(books.id, bookId))
        .returning();

      if (authors) {
        await updateTableRelations({
          transaction,
          where: { bookId },
          table: booksAuthors,
          values: authors.map((authorId) => ({
            authorId,
            bookId,
          })),
        });
      }

      if (genres) {
        await updateTableRelations({
          transaction,
          where: { bookId },
          table: booksGenres,
          values: genres.map((genreId) => ({
            genreId,
            bookId,
          })),
        });
      }

      return updatedBook;
    });
  }

  delete(id: number) {
    return this.deps.db.delete(books).where(eq(books.id, id));
  }

  getEditableBook(id: number) {
    return this.deps.db.query.books.findFirst({
      where: eq(books.id, id),
      with: {
        authors: true,
        genres: true,
      },
    });
  }

  async findOrder(title: string) {
    const targetBook = await this.deps.db.query.books.findFirst({
      where: ilike(books.title, sqlSearchQuery(title)),
      columns: {
        readingOrder: true,
      },
    });

    if (!targetBook) {
      return { targetBook: null, nextBook: null };
    }

    const nextBook = await this.deps.db.query.books.findFirst({
      columns: {
        readingOrder: true,
      },
      where: gt(books.readingOrder, targetBook.readingOrder),
      orderBy: asc(books.readingOrder),
    });

    return {
      targetBook,
      nextBook,
    };
  }

  search(title: string) {
    return this.deps.db
      .select({ title: books.title, id: books.id })
      .from(books)
      .where(ilike(books.title, sqlSearchQuery(title)));
  }

  getByIds(ids: number[]) {
    return this.deps.db
      .select({ title: books.title, id: books.id })
      .from(books)
      .where(inArray(books.id, ids));
  }

  getSeries(id: number) {
    return this.deps.db
      .select({
        id: books.id,
        title: books.title,
        imagePath: books.imagePath,
        order: books.seriesOrder,
      })
      .from(books)
      .where(or(eq(books.id, id), eq(books.firstBookId, id)))
      .orderBy(sql`${books.seriesOrder} ASC NULLS FIRST`);
  }

  private mapSorting(key: string = 'updatedAt', direction: SortingOrder = 'desc') {
    return getDirectionFn(direction)(books[key as keyof Book]);
  }
}

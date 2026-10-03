import {
  getSkipValue,
  PAGE_LIMITS,
  type BookInput,
  type BooksListQueryParams,
  type BookUpdateInput,
  type SortingOrder,
} from '@hobbies-collection/shared';
import { eq } from 'drizzle-orm';
import {
  books,
  booksAuthors,
  booksCollections,
  booksGenres,
  type Book,
} from '~/database/schema.js';
import { getDirectionFn } from '~/shared/helpers/get-direction-fn.js';
import { updateTableRelations } from '~/shared/helpers/update-table-relations.js';
import type { Deps } from '~/shared/types/deps.js';

export class BooksRepository {
  constructor(private readonly deps: Deps<'db'>) {}

  list(queryParams?: BooksListQueryParams) {
    const sorting = this.mapSorting(queryParams?.orderKey, queryParams?.order);
    return this.deps.db
      .select({
        id: books.id,
        title: books.title,
        imagePath: books.imagePath,
        publicationYear: books.publicationYear,
      })
      .from(books)
      .limit(PAGE_LIMITS.booksList)
      .orderBy(sorting)
      .offset(getSkipValue('booksList', queryParams?.pageIndex));
  }

  get(id: number) {
    return this.deps.db.query.books.findFirst({
      where: eq(books.id, id),
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
        collections: true,
      },
    });
  }

  create(input: BookInput) {
    return this.deps.db.transaction(async (tr) => {
      const { authors, genres, collections, ...bookInput } = input;
      const [newBook] = await tr.insert(books).values(bookInput).returning();

      const bookId = newBook.id;

      if (authors.length) {
        await tr.insert(booksAuthors).values(authors.map((authorId) => ({ authorId, bookId })));
      }

      if (genres.length) {
        await tr.insert(booksGenres).values(genres.map((genreId) => ({ genreId, bookId })));
      }

      if (collections.length) {
        await tr
          .insert(booksCollections)
          .values(collections.map((collectionId) => ({ collectionId, bookId })));
      }

      return newBook;
    });
  }

  update(bookId: number, input: BookUpdateInput) {
    return this.deps.db.transaction(async (transaction) => {
      const { authors, collections, genres, ...bookParams } = input;

      const [updatedBook] = await transaction
        .update(books)
        .set(bookParams)
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

      if (collections) {
        await updateTableRelations({
          transaction,
          where: { bookId },
          table: booksCollections,
          values: collections.map((collectionId) => ({
            collectionId,
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

  private mapSorting(key: string = 'updatedAt', direction: SortingOrder = 'desc') {
    return getDirectionFn(direction)(books[key as keyof Book]);
  }
}

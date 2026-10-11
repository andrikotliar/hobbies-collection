import type { BooksListQueryParams } from '@hobbies-collection/shared';
import { and, eq, exists, ilike, inArray, type SQL } from 'drizzle-orm';
import { books, booksAuthors, booksGenres } from '~/database/schema.js';
import type { Database } from '~/plugins/index.js';
import { sqlSearchQuery } from '~/shared/helpers/sql-search-query.js';

export const mapBooksListFilters = (
  db: Database,
  queryParams: BooksListQueryParams | undefined,
): SQL[] => {
  if (!queryParams) {
    return [];
  }

  const { rating, authorIds, genreIds, q } = queryParams;

  const filters: SQL[] = [];

  if (q) {
    filters.push(ilike(books.title, sqlSearchQuery(q)));
  }

  if (rating) {
    filters.push(eq(books.rating, rating));
  }

  if (authorIds?.length) {
    filters.push(
      exists(
        db
          .select()
          .from(booksAuthors)
          .where(and(eq(books.id, booksAuthors.bookId), inArray(booksAuthors.authorId, authorIds))),
      ),
    );
  }

  if (genreIds?.length) {
    filters.push(
      exists(
        db
          .select()
          .from(booksGenres)
          .where(and(eq(books.id, booksGenres.bookId), inArray(booksGenres.genreId, genreIds))),
      ),
    );
  }

  return filters;
};

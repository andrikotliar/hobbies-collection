import {
  getSkipValue,
  PAGE_LIMITS,
  type CommonListQueryParams,
  type CreateCollectionInput,
  type UpdateCollectionInput,
} from '@hobbies-collection/shared';
import { and, asc, eq, type SQL, exists } from 'drizzle-orm';
import { collections, hobbyItems, hobbyItemsCollections } from '~/database/schema.js';
import { getCount } from '~/shared/helpers/get-count.js';
import { getFirstValue } from '~/shared/helpers/get-first-value.js';
import { mapCommonFilters } from '~/shared/helpers/map-common-filters.js';
import type { Deps } from '~/shared/types/deps.js';

export class CollectionsRepository {
  constructor(private readonly deps: Deps<'db'>) {}

  getCollectionById(id: number) {
    return getFirstValue(this.deps.db.select().from(collections).where(eq(collections.id, id)));
  }

  getAll() {
    return this.deps.db
      .select({
        id: collections.id,
        title: collections.title,
      })
      .from(collections)
      .where(eq(collections.category, 'GENERAL'))
      .orderBy(asc(collections.title));
  }

  async getList(queries: CommonListQueryParams) {
    const filters = mapCommonFilters(queries, collections);
    const list = await this.deps.db
      .select({
        id: collections.id,
        title: collections.title,
      })
      .from(collections)
      .where(and(...filters, eq(collections.category, 'GENERAL')))
      .orderBy(asc(collections.title))
      .limit(PAGE_LIMITS.default)
      .offset(getSkipValue('default', queries.pageIndex));

    const total = await this.count(filters);

    return { list, total };
  }

  count(filters?: SQL[]) {
    return getCount(this.deps.db, collections, filters);
  }

  create(input: CreateCollectionInput) {
    return getFirstValue(this.deps.db.insert(collections).values(input).returning());
  }

  async delete(id: number) {
    await this.deps.db.delete(collections).where(eq(collections.id, id));
  }

  async update(id: number, input: UpdateCollectionInput) {
    const [collection] = await this.deps.db
      .update(collections)
      .set(input)
      .where(eq(collections.id, id))
      .returning();

    return collection;
  }

  async getHobbyRelatedCollections(hobbyId: number) {
    return this.deps.db
      .select()
      .from(collections)
      .where(
        exists(
          this.deps.db
            .select()
            .from(hobbyItemsCollections)
            .innerJoin(
              hobbyItems,
              and(
                eq(hobbyItems.id, hobbyItemsCollections.hobbyItemId),
                eq(hobbyItems.hobbyId, hobbyId),
              ),
            )
            .where(eq(hobbyItemsCollections.collectionId, collections.id)),
        ),
      );
  }
}

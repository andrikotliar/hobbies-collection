import {
  getSkipValue,
  PAGE_LIMITS,
  type BoardGameInput,
  type BoardGamesListQueryParams,
  type BoardGameUpdateInput,
  type SortingOrder,
} from '@hobbies-collection/shared';
import { and, eq, isNull } from 'drizzle-orm';
import { boardGames, boardGamesCreators, type BoardGame } from '~/database/schema.js';
import { getDirectionFn } from '~/shared/helpers/get-direction-fn.js';
import { updateTableRelations } from '~/shared/helpers/update-table-relations.js';
import type { Deps } from '~/shared/types/deps.js';

export class BoardGamesRepository {
  constructor(private readonly deps: Deps<'db'>) {}

  list(queries?: BoardGamesListQueryParams) {
    const sorting = this.mapSorting(queries?.orderKey, queries?.order);
    return this.deps.db
      .select({
        id: boardGames.id,
        title: boardGames.title,
        releasedYear: boardGames.releasedYear,
        imagePath: boardGames.imagePath,
      })
      .from(boardGames)
      .where(isNull(boardGames.mainGameId))
      .limit(PAGE_LIMITS.boardGames)
      .offset(getSkipValue('boardGames', queries?.pageIndex))
      .orderBy(sorting);
  }

  get(id: number) {
    return this.deps.db.query.boardGames.findFirst({
      where: and(eq(boardGames.id, id), isNull(boardGames.mainGameId)),
      columns: {
        id: true,
        title: true,
        description: true,
        gamesPlayed: true,
        releasedYear: true,
        rating: true,
        imagePath: true,
      },
      with: {
        creators: {
          with: {
            creator: {
              columns: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  getExpansions(mainGameId: number) {
    return this.deps.db
      .select({
        id: boardGames.id,
        title: boardGames.title,
        releasedYear: boardGames.releasedYear,
        imagePath: boardGames.imagePath,
      })
      .from(boardGames)
      .where(eq(boardGames.mainGameId, mainGameId));
  }

  delete(id: number) {
    return this.deps.db.delete(boardGames).where(eq(boardGames.id, id));
  }

  create(input: BoardGameInput) {
    return this.deps.db.transaction(async (tr) => {
      const { creators, ...boardGameInput } = input;
      const [newBoardGame] = await tr.insert(boardGames).values(boardGameInput).returning();

      if (creators.length) {
        await tr.insert(boardGamesCreators).values(
          creators.map((creatorId) => ({
            creatorId,
            boardGameId: newBoardGame.id,
          })),
        );
      }

      return newBoardGame;
    });
  }

  update(boardGameId: number, input: BoardGameUpdateInput) {
    return this.deps.db.transaction(async (transaction) => {
      const { creators, ...boardGameInput } = input;

      const [updatedBoardGame] = await transaction
        .update(boardGames)
        .set(boardGameInput)
        .where(eq(boardGames.id, boardGameId))
        .returning();

      if (creators) {
        await updateTableRelations({
          table: boardGamesCreators,
          where: { boardGameId },
          values: creators.map((creatorId) => ({
            creatorId,
            boardGameId,
          })),
          transaction,
        });
      }

      return updatedBoardGame;
    });
  }

  private mapSorting(key: string = 'updatedAt', direction: SortingOrder = 'desc') {
    return getDirectionFn(direction)(boardGames[key as keyof BoardGame]);
  }
}

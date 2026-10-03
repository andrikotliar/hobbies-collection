import type {
  BoardGameInput,
  BoardGameResponse,
  BoardGamesListQueryParams,
  BoardGamesListResponse,
  BoardGameUpdateInput,
} from '@hobbies-collection/shared';
import { throwIfNotFound } from '~/shared/helpers/throw-if-not-found.js';
import type { Deps } from '~/shared/types/deps.js';

export class BoardGamesService {
  constructor(private readonly deps: Deps<'boardGamesRepository'>) {}

  getList(queries?: BoardGamesListQueryParams): Promise<BoardGamesListResponse> {
    return this.deps.boardGamesRepository.list(queries);
  }

  async getBoardGame(id: number): Promise<BoardGameResponse> {
    const data = await throwIfNotFound(this.deps.boardGamesRepository.get(id));

    const expansions = await this.deps.boardGamesRepository.getExpansions(data.id);

    return {
      ...data,
      creators: data.creators.map((row) => row.creator),
      expansions,
    };
  }

  deleteBoardGame(id: number) {
    return this.deps.boardGamesRepository.delete(id);
  }

  createBoardGame(input: BoardGameInput) {
    return this.deps.boardGamesRepository.create(input);
  }

  updateBoardGame(id: number, input: BoardGameUpdateInput) {
    return this.deps.boardGamesRepository.update(id, input);
  }
}

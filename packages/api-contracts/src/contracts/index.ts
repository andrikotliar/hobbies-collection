import { authContract } from './auth.contract.js';
import { awardsContract } from './awards.contract.js';
import { collectionEventsContract } from './collection-events.contract.js';
import { collectionsContract } from './collections.contract.js';
import { countriesContract } from './countries.contract.js';
import { filesContract } from './files.contract.js';
import { filmsContract } from './films.contract.js';
import { genresContract } from './genres.contract.js';
import { initialDataContract } from './initial-data.contract.js';
import { articlesContract } from './articles.contract.js';
import { peopleContract } from './people.contract.js';
import { studiosContract } from './studios.contract.js';
import { usersContracts } from './users.contract.js';
import { booksContract } from './books.contract.js';
import { boardGamesContract } from './board-games.contract.js';

export const contracts = {
  auth: authContract,
  awards: awardsContract,
  boardGames: boardGamesContract,
  books: booksContract,
  collectionEvents: collectionEventsContract,
  collections: collectionsContract,
  countries: countriesContract,
  files: filesContract,
  films: filmsContract,
  genres: genresContract,
  initialData: initialDataContract,
  articles: articlesContract,
  people: peopleContract,
  studios: studiosContract,
  users: usersContracts,
} as const;

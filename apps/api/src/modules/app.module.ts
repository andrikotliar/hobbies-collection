import { AiService } from '~/modules/ai/ai.service.js';
import { ArticlesRepository } from '~/modules/articles/articles.repository.js';
import { articlesRouter } from '~/modules/articles/articles.router.js';
import { ArticlesService } from '~/modules/articles/articles.service.js';
import { authRouter } from '~/modules/auth/auth.router.js';
import { AuthService } from '~/modules/auth/auth.service.js';
import { AwardsRepository } from '~/modules/awards/awards.repository.js';
import { awardsRouter } from '~/modules/awards/awards.router.js';
import { AwardsService } from '~/modules/awards/awards.service.js';
import { BooksRepository } from '~/modules/books/books.repository.js';
import { BooksService } from '~/modules/books/books.service.js';
import { InMemoryCacheService } from '~/modules/cache/cache.service.js';
import { CollectionEventsRepository } from '~/modules/collection-events/collection-events.repository.js';
import { collectionEventsRouter } from '~/modules/collection-events/collection-events.router.js';
import { CollectionEventsService } from '~/modules/collection-events/collection-events.service.js';
import { CollectionsRepository } from '~/modules/collections/collections.repository.js';
import { collectionsRouter } from '~/modules/collections/collections.router.js';
import { CollectionsService } from '~/modules/collections/collections.service.js';
import { ConfigService } from '~/modules/config/config.service.js';
import { CookiesService } from '~/modules/cookies/cookies.service.js';
import { CountriesRepository } from '~/modules/countries/countries.repository.js';
import { countriesRouter } from '~/modules/countries/countries.router.js';
import { CountriesService } from '~/modules/countries/countries.service.js';
import { filesRouter } from '~/modules/files/files.router.js';
import { FilesService } from '~/modules/files/files.service.js';
import { FilmsRepository } from '~/modules/films/films.repository.js';
import { filmsRouter } from '~/modules/films/films.router.js';
import { FilmsService } from '~/modules/films/films.service.js';
import { GenresRepository } from '~/modules/genres/genres.repository.js';
import { genresRouter } from '~/modules/genres/genres.router.js';
import { GenresService } from '~/modules/genres/genres.service.js';
import { HashService } from '~/modules/hash/hash.service.js';
import { initialDataRouter } from '~/modules/initial-data/initial-data.router.js';
import { InitialDataService } from '~/modules/initial-data/initial-data.service.js';
import { PeopleRepository } from '~/modules/people/people.repository.js';
import { peopleRouter } from '~/modules/people/people.router.js';
import { PeopleService } from '~/modules/people/people.service.js';
import { StorageService } from '~/modules/storage/storage.service.js';
import { StudiosRepository } from '~/modules/studios/studios.repository.js';
import { studiosRouter } from '~/modules/studios/studios.router.js';
import { StudiosService } from '~/modules/studios/studios.service.js';
import { UsersRepository } from '~/modules/users/users.repository.js';
import { usersRouter } from '~/modules/users/users.router.js';
import { UsersService } from '~/modules/users/users.service.js';

export const services = {
  aiService: AiService,
  authService: AuthService,
  awardsRepository: AwardsRepository,
  awardsService: AwardsService,
  articlesRepository: ArticlesRepository,
  articlesService: ArticlesService,
  booksRepository: BooksRepository,
  booksService: BooksService,
  collectionEventsRepository: CollectionEventsRepository,
  collectionEventsService: CollectionEventsService,
  collectionsRepository: CollectionsRepository,
  collectionsService: CollectionsService,
  configService: ConfigService,
  countriesRepository: CountriesRepository,
  countriesService: CountriesService,
  filesService: FilesService,
  filmsRepository: FilmsRepository,
  filmsService: FilmsService,
  genresRepository: GenresRepository,
  genresService: GenresService,
  initialDataService: InitialDataService,
  inMemoryCacheService: InMemoryCacheService,
  peopleRepository: PeopleRepository,
  peopleService: PeopleService,
  storageService: StorageService,
  studiosRepository: StudiosRepository,
  studiosService: StudiosService,
  usersRepository: UsersRepository,
  usersService: UsersService,
  cookiesService: CookiesService,
  hashService: HashService,
};

export const routers = [
  articlesRouter,
  authRouter,
  awardsRouter,
  collectionEventsRouter,
  collectionsRouter,
  countriesRouter,
  filesRouter,
  filmsRouter,
  genresRouter,
  initialDataRouter,
  peopleRouter,
  studiosRouter,
  usersRouter,
];

export type ApiServices = typeof services;

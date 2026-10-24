import { convertEnumValuesToOption, type InitialDataResponse } from '@hobbies-collection/shared';
import { personRole, filmType } from '~/database/schema.js';
import type { Deps } from '~/shared/types/deps.js';

export class InitialDataService {
  constructor(
    private readonly deps: Deps<
      | 'collectionsService'
      | 'genresService'
      | 'countriesService'
      | 'studiosService'
      | 'collectionEventsService'
      | 'awardsService'
      | 'filmsService'
      | 'peopleService'
    >,
  ) {}

  async getOptions(): Promise<InitialDataResponse> {
    const [collections, genres, countries, studios, awards, selectedPeople] = await Promise.all([
      this.deps.collectionsService.getAllCollections(),
      this.deps.genresService.getListOptions(),
      this.deps.countriesService.getListOptions(),
      this.deps.studiosService.getListOptions(),
      this.deps.awardsService.getListOptions(),
      this.deps.peopleService.getSelectedListOptions(),
    ]);

    const types = convertEnumValuesToOption(filmType.enumValues);
    const roles = convertEnumValuesToOption(personRole.enumValues);

    return {
      options: {
        collections,
        genres,
        countries,
        studios,
        types,
        roles,
        awards,
        selectedPeople,
      },
    };
  }
}

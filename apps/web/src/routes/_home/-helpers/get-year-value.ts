import { getPluralWord, getYearFromDate, type api, type ApiResponse } from '~/shared';

export const getYearValue = (film: ApiResponse<typeof api.films.getList>['list'][number]) => {
  if (film.releasedYears) {
    return `Anniversary: ${film.releasedYears} years (${getYearFromDate(film.releaseDate)})`;
  }

  if (film.inDays) {
    return `In ${film.inDays} ${getPluralWord('day', film.inDays)}`;
  }

  return getYearFromDate(film.releaseDate);
};

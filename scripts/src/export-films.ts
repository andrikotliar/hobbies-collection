import { type CompleteDataResponse } from '@hobbies-collection/shared';
import crypto from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import type z from 'zod';
import { ExportFilmScriptSchema, getEnvironment, logger } from '~/helpers/index.js';
import type { ApiResult } from '~/types.js';
import { okResponse } from '~/helpers/ok-response.js';

const DATA_FOLDER = path.join(import.meta.dirname, '../../apps/api/data');
const COMMON_VALUES_FOLDER = path.join(DATA_FOLDER, 'common/values');
const FILMS_VALUES_FOLDER = path.join(DATA_FOLDER, 'films/values');
const FILMS_ITEMS_FOLDER = path.join(DATA_FOLDER, 'films/items');
const NUMBER_REGEX = /^\d+$/;

const commonData = ['collections', 'genres', 'people'];

type QueryParams = {
  intervalDays: number;
  newestOnly: boolean;
};

const fetchData = async (
  env: z.infer<typeof ExportFilmScriptSchema>,
  queries: QueryParams,
): Promise<ApiResult<CompleteDataResponse>> => {
  try {
    const timestamp = Date.now().toString();
    const urlObject = new URL(env.FILMS_EXPORT_URL);
    const method = 'GET';

    const payload = `${method}.${urlObject.pathname}.${timestamp}`;

    const signature = crypto
      .createHmac('sha256', env.SIGNATURE_SECRET)
      .update(payload)
      .digest('hex');

    const searchParams = new URLSearchParams();

    searchParams.set('intervalDays', queries.intervalDays.toString());
    searchParams.set('newestOnly', String(queries.newestOnly).toLowerCase());

    const fullUrl = `${env.FILMS_EXPORT_URL}?${searchParams.toString()}`;

    logger.info(`Fetching data from ${fullUrl}`);

    const response = await fetch(fullUrl, {
      method,
      headers: {
        'x-timestamp': timestamp,
        'x-signature': signature,
      },
    });

    if (!response.ok) {
      const data = await response.text();
      return {
        ok: false,
        error: JSON.stringify({ status: response.status, data, statusText: response.statusText }),
      };
    }

    const data = await response.json();

    return okResponse<CompleteDataResponse>(data);
  } catch (e) {
    return {
      ok: false,
      error: JSON.stringify(e),
    };
  }
};

type BaseDataItems = keyof CompleteDataResponse['baseData'];
const baseDataItems: BaseDataItems[] = ['genres', 'countries', 'studios', 'awards', 'people'];

const getDestinationFolder = (item: BaseDataItems) => {
  if (commonData.includes(item)) {
    return COMMON_VALUES_FOLDER;
  }

  return FILMS_VALUES_FOLDER;
};

const sanitizeFileName = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[<>:,\-"/\\|?*]+/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s/g, '_')
    .replace('&', 'and')
    .trim();
};

const writeDataToFile = async (path: string, data: unknown) => {
  await fs.writeFile(path, JSON.stringify(data, null, 2), 'utf-8');
};

const getIntervalNumber = () => {
  const intervalPosition = process.argv.findIndex((arg) => arg === '--interval');

  if (intervalPosition < 0 || !NUMBER_REGEX.test(process.argv[intervalPosition + 1])) {
    return 7;
  }

  return Number(process.argv[intervalPosition + 1]);
};

const run = async () => {
  if (!existsSync(DATA_FOLDER)) {
    await fs.mkdir(DATA_FOLDER, { recursive: true });
  }

  const interval = getIntervalNumber();
  const shouldFetchAllFilms = process.argv.includes('--all');

  logger.info(
    `Fetching films with interval ${interval} days, should fetch all films: ${shouldFetchAllFilms}`,
  );

  const env = getEnvironment(ExportFilmScriptSchema);
  const result = await fetchData(env, {
    intervalDays: interval,
    newestOnly: !shouldFetchAllFilms,
  });

  if (!result.ok) {
    logger.error(`Error fetching data ${result.error}`);
    process.exit(1);
  }

  logger.info(`Films count: ${result.data.list.length}`);
  logger.info(`Genres count: ${result.data.baseData.genres.length}`);
  logger.info(`Countries count: ${result.data.baseData.countries.length}`);
  logger.info(`Studios count: ${result.data.baseData.studios.length}`);
  logger.info(`Awards count: ${result.data.baseData.awards.length}`);
  logger.info(`People count: ${result.data.baseData.people.length}`);

  try {
    for (const baseDataItem of baseDataItems) {
      const filePath = `${getDestinationFolder(baseDataItem)}/${baseDataItem}.json`;

      const item = result.data.baseData[baseDataItem];

      if (item.length) {
        await writeDataToFile(filePath, result.data.baseData[baseDataItem]);
      }
    }

    if (!result.data.list.length) {
      process.exit(0);
    }

    const filmsFolder = path.join(FILMS_ITEMS_FOLDER);

    if (!existsSync(filmsFolder)) {
      await fs.mkdir(filmsFolder);
    }

    for (const film of result.data.list) {
      const filmPath = `${filmsFolder}/${sanitizeFileName(film.title)}.json`;
      await writeDataToFile(filmPath, film);
    }

    process.exit(0);
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(`Error writing data files ${error.message}`);
    }

    process.exit(1);
  }
};

run().catch((error) => logger.error(`Export films failed ${error.message}`));

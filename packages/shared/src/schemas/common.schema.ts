import type { z } from 'zod';
import { buildListQueryParamsSchema } from '../helpers/build-list-query-params-schema.js';

export const CommonListQuerySchema = buildListQueryParamsSchema();

export type CommonListQueryParams = z.infer<typeof CommonListQuerySchema>;

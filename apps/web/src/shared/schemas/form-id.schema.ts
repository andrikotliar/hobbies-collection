import { NEW_ITEM_ID } from '@hobbies-collection/shared';
import { z } from 'zod';

export const FormIdParamSchema = z.enum([NEW_ITEM_ID]).or(z.number());

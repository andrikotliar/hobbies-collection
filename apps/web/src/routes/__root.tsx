import z from 'zod';
import { type QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext } from '@tanstack/react-router';
import { GlobalLayout } from '~/shared/components/global-layout';

const RootSearchSchema = z.object({
  filmId: z.coerce.number().optional(),
});

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: () => void 0,
  validateSearch: (search) => {
    return RootSearchSchema.parse(search);
  },
  component: () => <GlobalLayout />,
});

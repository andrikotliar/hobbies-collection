import './main.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { FileRoutesByTo } from '~/routeTree.gen';
import { router } from '~/shared/services/router';
import type { InvalidateQueryOption } from '~/shared/types/invalidate-query-option';
import { queryClient } from '~/shared/services/query-client';
import { FilterProvider } from '~/shared/components/filters/filter-provider';
import { Toaster } from '~/shared/components/modals/toaster';

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
  interface StaticDataRouteOption {
    title?: string;
    backPath?: keyof FileRoutesByTo;
    preserveSearch?: boolean;
  }
}

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      invalidateQueries?: InvalidateQueryOption | InvalidateQueryOption[];
      successMessage?: string;
      skipErrorToast?: boolean;
    };
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <FilterProvider>
        <RouterProvider router={router} />
        <Toaster />
        {/* <ReactQueryDevtools buttonPosition="top-left" /> */}
      </FilterProvider>
    </QueryClientProvider>
  </StrictMode>,
);

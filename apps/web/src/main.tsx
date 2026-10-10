import './main.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster, queryClient, type InvalidateQueryOption, router } from '~/shared';
import type { FileRoutesByTo } from '~/routeTree.gen';

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
      <RouterProvider router={router} />
      <Toaster />
      <ReactQueryDevtools buttonPosition="top-left" />
    </QueryClientProvider>
  </StrictMode>,
);

import { MutationCache, QueryClient } from '@tanstack/react-query';
import { toaster } from '~/shared/utils/toaster';

const getQueryKey = (value: string | number | (string | number)[]) => {
  if (Array.isArray(value)) {
    return value;
  }

  return [value];
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 30_000,
    },
  },
  mutationCache: new MutationCache({
    onSuccess: (_data, _vars, _ctx, mutation) => {
      if (mutation.meta?.successMessage) {
        toaster.success(mutation.meta.successMessage);
      }

      if (mutation.meta?.invalidateQueries) {
        const options = mutation.meta.invalidateQueries;

        if (Array.isArray(options)) {
          for (const option of options) {
            queryClient.invalidateQueries({ queryKey: getQueryKey(option.queryKey) });
          }
          return;
        }

        queryClient.invalidateQueries({ queryKey: getQueryKey(options.queryKey) });
      }
    },
    onError: (error, _vars, _ctv, mutation) => {
      if (mutation.meta?.skipErrorToast) {
        return;
      }

      toaster.error(error);
    },
  }),
});

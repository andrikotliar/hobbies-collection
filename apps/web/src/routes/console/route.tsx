import { createFileRoute, redirect } from '@tanstack/react-router';
import { ConsoleRootLayout } from '~/shared/components/layout/console-root-layout';
import { LOGIN_BLOCK_KEY } from '~/shared/constants/app';
import { getAuthStateQueryOptions } from '~/shared/helpers/query-options/auth/get-auth-state-query-options';

export const Route = createFileRoute('/console')({
  beforeLoad: async ({ context: { queryClient } }) => {
    try {
      await queryClient.ensureQueryData(getAuthStateQueryOptions());
    } catch {
      localStorage.removeItem(LOGIN_BLOCK_KEY);
      throw redirect({ to: '/login', search: { from: window.location.pathname } });
    }
  },
  component: ConsoleRootLayout,
});

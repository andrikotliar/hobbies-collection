import { z } from 'zod';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { LOGIN_BLOCK_KEY } from '~/shared/constants/app';
import { LoginLayout } from '~/routes/login/-components/login-layout/login-layout';
import { LoginForm } from '~/routes/login/-components/login-form/login-form';

const SearchParamsSchema = z.object({
  from: z.string().optional(),
});

export const Route = createFileRoute('/login')({
  validateSearch: (search: z.infer<typeof SearchParamsSchema>) => {
    return SearchParamsSchema.parse(search);
  },
  loaderDeps: ({ search }) => search,
  beforeLoad: async () => {
    const isLoginBlocked = localStorage.getItem(LOGIN_BLOCK_KEY) === 'true';

    if (isLoginBlocked) {
      throw redirect({ to: '/console' });
    }
  },
  component: PageContainer,
  head: () => ({ meta: [{ title: 'Login - Films Collection' }] }),
});

function PageContainer() {
  return (
    <LoginLayout>
      <LoginForm />
    </LoginLayout>
  );
}

import { LogInIcon } from 'lucide-react';
import { LoginSchema } from '@hobbies-collection/shared';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import type { Input } from '~/shared/types/extract-params';
import { api } from '~/shared/services/api';
import { LOGIN_BLOCK_KEY } from '~/shared/constants/app';
import { AppForm } from '~/shared/components/form/app-form';
import { Logo } from '~/shared/components/ui/logo';

const defaultLoginValues: Input<typeof api.auth.login> = {
  username: '',
  password: '',
};

export const LoginForm = () => {
  const search = useSearch({ from: '/login' });

  const navigate = useNavigate();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (input: Parameters<typeof api.auth.login>[0]['input']) => {
      return api.auth.login({ input });
    },
    onSuccess: (result) => {
      if (result.id) {
        localStorage.setItem(LOGIN_BLOCK_KEY, 'true');
        if (search.from && search.from.includes('console')) {
          navigate({ to: search.from, replace: true });
          return;
        }

        navigate({ to: '/console', replace: true });
      }
    },
  });

  return (
    <AppForm
      onSubmit={mutateAsync}
      isLoading={isPending}
      defaultValues={defaultLoginValues}
      schema={LoginSchema}
      submitIcon={<LogInIcon />}
      submitButtonText="Login"
    >
      <div className="mx-auto">
        <Logo size={120} />
      </div>
      <AppForm.TextInput name="username" label="Username" />
      <AppForm.PasswordInput name="password" label="Password" />
    </AppForm>
  );
};

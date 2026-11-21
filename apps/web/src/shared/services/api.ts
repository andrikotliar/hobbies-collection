import { redirect } from '@tanstack/react-router';
import { createApiClient, HttpError } from '@hobbies-collection/contracts';
import type { ErrorCode } from '@hobbies-collection/shared';
import { queryClient } from '~/shared/services/query-client';
import { LOGIN_BLOCK_KEY } from '~/shared/constants/app';

const TOKEN_ERRORS: Extract<ErrorCode, 'TOKEN_EXPIRED' | 'TOKEN_MISSED'>[] = [
  'TOKEN_EXPIRED',
  'TOKEN_MISSED',
];

const baseUrl = import.meta.env.VITE_SERVER_API_URL;

let refreshPromise: Promise<void> | null = null;

const refreshToken = async () => {
  if (!refreshPromise) {
    refreshPromise = fetch(`${baseUrl}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) {
          throw new HttpError(401, 'Unauthorized', res);
        }
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

export const api = createApiClient({
  baseUrl,
  onError: async (error, originalRequest) => {
    if (error.response?.statusCode === 401 && !window.location.pathname.includes('login')) {
      try {
        if (!TOKEN_ERRORS.includes(error.response?.code)) {
          throw new HttpError(error.response.status, error.response.statusText, error.response);
        }

        await refreshToken();

        return originalRequest();
      } catch (_error) {
        localStorage.removeItem(LOGIN_BLOCK_KEY);
        queryClient.removeQueries({ queryKey: queryKey('auth.getState') });
        throw redirect({ to: '/login' });
      }
    }

    throw new HttpError(
      error.response?.statusCode,
      error.response?.message ?? 'Unknown error',
      error.response,
    );
  },
});

type Paths<T> = T extends object
  ? {
      [K in keyof T & string]: K | `${K}.${Paths<T[K]>}`;
    }[keyof T & string]
  : never;

export const queryKey = <TKey extends Paths<typeof api>>(
  key: TKey,
  ...args: any
): [TKey, ...any[]] => [key, ...args];

import { createFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';
import {
  isNewItem,
  getInitialDataQueryOptions,
  getAdminFilmDetailsQueryOptions,
  getMixedId,
  getFilmDraftsQueryOptions,
} from '~/shared';
import { filmDefaultFormValues } from '~/routes/console/-shared';
import { FilmForm } from '~/routes/console/films_/-components';
import type z from 'zod';
import { useSuspenseQuery } from '@tanstack/react-query';
import type { FilmFormSchema } from '~/routes/console/films_/-components/film-form/-schemas';
import { GetAdminListQuerySchema } from '@hobbies-collection/shared';

export const Route = createFileRoute('/console/films_/$id')({
  validateSearch: (search) => GetAdminListQuerySchema.parse(search),
  loaderDeps: ({ search }) => {
    return {
      search,
    };
  },
  loader: async ({ context: { queryClient }, params }) => {
    await queryClient.ensureQueryData(getInitialDataQueryOptions());
    await queryClient.ensureQueryData(getFilmDraftsQueryOptions(params.id));

    if (!isNewItem(params.id)) {
      return await queryClient.ensureQueryData(getAdminFilmDetailsQueryOptions(Number(params.id)));
    }
  },
  component: PageContainer,
  staticData: {
    title: 'Films',
    backPath: '/console/films',
    preserveSearch: true,
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.title ?? 'New film'} - Films Collection`,
      },
    ],
  }),
});

function PageContainer() {
  const { id } = Route.useParams();
  const { data: film } = useSuspenseQuery(getAdminFilmDetailsQueryOptions(getMixedId(id)));

  const defaultValues = useMemo<z.infer<typeof FilmFormSchema>>(() => {
    if (film) {
      return {
        ...film,
        id: Number(id),
      };
    }

    return filmDefaultFormValues;
  }, [id, film]);

  return <FilmForm values={defaultValues} />;
}

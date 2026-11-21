import { useMemo } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import type z from 'zod';
import { GetAdminListQuerySchema } from '@hobbies-collection/shared';
import { getInitialDataQueryOptions } from '~/shared/helpers/query-options/initial-data/get-initial-data-query-options';
import { getFilmDraftsQueryOptions } from '~/shared/helpers/query-options/films/get-film-drafts-query-options';
import { isNewItem } from '~/shared/helpers/is-new-item';
import { getAdminFilmDetailsQueryOptions } from '~/shared/helpers/query-options/films/get-admin-film-details-query-options';
import { getMixedId } from '~/shared/helpers/get-mixed-id';
import { FilmForm } from './-components/film-form/film-form';
import type { FilmFormSchema } from '~/shared/schemas/film-form.schema';
import { filmDefaultFormValues } from '~/shared/configs/film-default-form-values';

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

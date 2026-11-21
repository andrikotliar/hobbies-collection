import { useMemo } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { AwardForm } from './-components/award-form';
import { getAwardQueryOptions } from '~/shared/helpers/query-options/awards/get-award-query-options';
import { getMixedId } from '~/shared/helpers/get-mixed-id';
import { getFormDefaultValues } from '~/routes/console/awards_/-helpers/get-award-default-form-values';

export const Route = createFileRoute('/console/awards_/$id')({
  loader: async ({ params, context: { queryClient } }) => {
    return await queryClient.ensureQueryData(getAwardQueryOptions(getMixedId(params.id)));
  },
  component: PageContainer,
  staticData: {
    title: 'Awards',
    backPath: '/console/awards',
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.title} - Films Collection`,
      },
    ],
  }),
});

function PageContainer() {
  const { id } = Route.useParams();

  const { data } = useSuspenseQuery(getAwardQueryOptions(getMixedId(id)));

  const defaultValues = useMemo(() => {
    return getFormDefaultValues(data);
  }, [data]);

  return <AwardForm values={defaultValues} />;
}

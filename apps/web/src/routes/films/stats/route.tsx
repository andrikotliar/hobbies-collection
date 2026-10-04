import { createFileRoute } from '@tanstack/react-router';
import { Navigation } from '~/routes/films/_root/-components/films-section/components';
import { ChartsGrid } from '~/routes/films/stats/-components/charts-grid/charts-grid';
import { StatsLayout } from '~/routes/films/stats/-components/stats-layout/stats-layout';
import { buildMetaTitle, buildGetFilmsStatsQueryOptions } from '~/shared';
import { useSuspenseQuery } from '@tanstack/react-query';
import { DonutChart } from '~/shared/components/donut-chart/donut-chart';
import { useMemo } from 'react';

export const Route = createFileRoute('/films/stats')({
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(buildGetFilmsStatsQueryOptions());
  },
  head: () => ({
    meta: [{ title: buildMetaTitle('Films Statistic') }],
  }),
});

function RouteComponent() {
  const { data } = useSuspenseQuery(buildGetFilmsStatsQueryOptions());

  const charts = useMemo(() => {
    return Object.keys(data.stats).map((key) => ({
      block: key,
      stats: data.stats[key as keyof typeof data.stats],
    }));
  }, [data]);

  return (
    <StatsLayout>
      <Navigation />
      <ChartsGrid>
        {charts.map((category) => (
          <DonutChart
            data={category.stats}
            title={category.block}
            total={data.filmsTotal}
            key={category.block}
          />
        ))}
      </ChartsGrid>
    </StatsLayout>
  );
}

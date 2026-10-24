import { createFileRoute } from '@tanstack/react-router';
import { Navigation } from '~/routes/_home/-components/films-section/components';
import { ChartsGrid } from '~/routes/films/stats/-components/charts-grid/charts-grid';
import { StatsLayout } from '~/routes/films/stats/-components/stats-layout/stats-layout';
import { getFilmsStatsQueryOptions } from '~/shared';
import { useSuspenseQuery } from '@tanstack/react-query';
import { DonutChart } from '~/shared/components/donut-chart/donut-chart';
import { useMemo } from 'react';

export const Route = createFileRoute('/films/stats')({
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(getFilmsStatsQueryOptions());
  },
  head: () => ({
    meta: [{ title: 'Films Statistic - Films Collection' }],
  }),
});

function RouteComponent() {
  const { data } = useSuspenseQuery(getFilmsStatsQueryOptions());

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
        {charts.map((chart) => (
          <DonutChart
            data={chart.stats}
            title={chart.block}
            total={data.filmsTotal}
            key={chart.block}
          />
        ))}
      </ChartsGrid>
    </StatsLayout>
  );
}

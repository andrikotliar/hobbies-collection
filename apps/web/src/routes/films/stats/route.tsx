import { createFileRoute } from '@tanstack/react-router';
import { ChartsGrid } from '~/routes/films/stats/-components/charts-grid';
import { useSuspenseQuery } from '@tanstack/react-query';
import { DonutChart } from '~/shared/components/ui/donut-chart';
import { useMemo } from 'react';
import { getFilmsStatsQueryOptions } from '~/shared/helpers/query-options/films/get-films-stats-query-options';
import { Navigation } from '~/routes/_home/-components/films-page-navigation';

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
    <div className="w-full p-5">
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
    </div>
  );
}

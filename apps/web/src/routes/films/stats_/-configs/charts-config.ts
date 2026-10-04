import { defineChart } from '@tanstack/charts';
import { geoShape } from '@tanstack/charts/geo';
import { geoEqualEarth } from 'd3-geo';
import { getWorldLand, getWorldSphere } from '~/routes/films/stats_/-helpers/get-country-atlas';

const projection = {
  type: geoEqualEarth,
  fit: 'sphere' as const,
};

const createCountriesChart = () => {
  const worldLand = getWorldLand();
  const worldSphere = getWorldSphere();

  return defineChart(
    {
      marks: [
        geoShape([worldLand], {
          projection,
          fill: '#e2e8f0',
          stroke: '#ffffff',
          strokeWidth: 0.5,
        }),
        geoShape([worldSphere], {
          projection,
          fill: 'none',
          stroke: 'currentColor',
          strokeOpacity: 0.35,
          strokeWidth: 0.75,
        }),
      ],
      scales: {
        x: null,
        y: null,
      },
      margin: 10,
    },
    { keyboard: false },
  );
};

export const getChartsConfig = () => {
  const countries = createCountriesChart();

  return {
    countries,
  };
};

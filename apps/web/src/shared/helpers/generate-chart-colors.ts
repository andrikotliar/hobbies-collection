export const CHART_COLORS = [
  'hsl(221 83% 53%)',
  'hsl(142 71% 45%)',
  'hsl(38 92% 50%)',
  'hsl(280 65% 60%)',
  'hsl(0 72% 55%)',
  'hsl(190 80% 45%)',
  'hsl(330 70% 55%)',
  'hsl(84 55% 45%)',
  'hsl(15 80% 55%)',
  'hsl(260 70% 55%)',
  'hsl(170 60% 40%)',
  'hsl(45 85% 55%)',
  'hsl(200 65% 50%)',
  'hsl(110 50% 45%)',
  'hsl(350 65% 50%)',
  'hsl(300 55% 50%)',
  'hsl(25 70% 45%)',
  'hsl(150 55% 50%)',
  'hsl(230 55% 65%)',
  'hsl(65 55% 45%)',
  'hsl(210 75% 40%)',
  'hsl(125 60% 40%)',
  'hsl(50 90% 45%)',
  'hsl(270 55% 45%)',
  'hsl(10 70% 45%)',
  'hsl(185 65% 40%)',
  'hsl(315 60% 45%)',
  'hsl(95 50% 40%)',
  'hsl(25 85% 60%)',
  'hsl(245 60% 60%)',
  'hsl(160 65% 45%)',
  'hsl(55 75% 50%)',
  'hsl(195 70% 55%)',
  'hsl(100 45% 50%)',
  'hsl(340 65% 60%)',
  'hsl(290 60% 60%)',
  'hsl(30 65% 55%)',
  'hsl(135 50% 55%)',
  'hsl(215 60% 60%)',
  'hsl(70 50% 50%)',
  'hsl(225 70% 65%)',
  'hsl(145 55% 60%)',
  'hsl(40 80% 60%)',
  'hsl(275 55% 70%)',
  'hsl(5 65% 65%)',
  'hsl(180 55% 55%)',
  'hsl(325 55% 65%)',
  'hsl(90 45% 60%)',
  'hsl(20 75% 65%)',
  'hsl(250 55% 70%)',
] as const;

export const generateChartColors = (count: number) => {
  return Array.from({ length: count }, (_, index) => {
    if (CHART_COLORS[index]) {
      const color = CHART_COLORS[index];

      return color;
    }

    const hue = (index * 137.508) % 360;

    return `hsl(${hue} 65% 55%)`;
  });
};

import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { generateChartColors } from '~/shared/helpers/generate-chart-colors';
import { createDonutChartSlicePath } from '~/shared/helpers/create-donut-chart-slice-path';

type Item = {
  title: string;
  value: number;
};

type Props = {
  data: Item[];
  size?: number;
  radius?: number;
  innerRadius?: number;
  title?: string;
  total: number;
};

type Slice = Item & {
  color: string;
  startAngle: number;
  endAngle: number;
  percentage: number;
};

const getDefaultInfoParams = (total: number) => {
  return { title: 'All', value: total, percentage: '100%', index: -1 };
};

const formatPercentage = (value: number) => {
  if (value > 0 && value < 1) {
    return '<1%';
  }

  return `${Math.round(value)}%`;
};

export const DonutChart = ({
  data,
  size = 240,
  radius = 100,
  title,
  innerRadius = 50,
  total,
}: Props) => {
  const [info, setInfo] = useState(getDefaultInfoParams(total));

  const colors = useMemo(() => {
    return generateChartColors(data.length);
  }, [data.length]);

  const totalByValues = useMemo(() => data.reduce((sum, item) => sum + item.value, 0), [data]);

  const slices = useMemo(() => {
    let currentAngle = 0;

    return data.map((item, index) => {
      const angle = (item.value / totalByValues) * 360;

      const slice: Slice = {
        ...item,
        color: colors[index],
        startAngle: currentAngle,
        endAngle: currentAngle + angle,
        percentage: (item.value / total) * 100,
      };

      currentAngle += angle;

      return slice;
    });
  }, [data, colors, totalByValues, total]);

  const handleMouseEnter = (slice: Slice, index: number) => {
    setInfo({
      title: slice.title,
      value: slice.value,
      percentage: formatPercentage(slice.percentage),
      index,
    });
  };

  const handleMouseLeave = () => {
    setInfo(getDefaultInfoParams(total));
  };

  return (
    <div className="bg-white rounded-lg p-5 shadow-sm [&:has(.highlighted_slice)_.slice:not(.highlighted_slice)]:opacity-20">
      {title && <div className="font-stretch-condensed uppercase text-xl">{title}</div>}
      <div className="flex flex-col items-center md:flex-row justify-center gap-6">
        <div className="relative">
          <svg width={size} height={size} viewBox="0 0 240 240">
            {slices.map((slice, index) => (
              <path
                onMouseEnter={() => handleMouseEnter(slice, index)}
                onMouseLeave={handleMouseLeave}
                key={slice.title}
                d={createDonutChartSlicePath(
                  120,
                  120,
                  radius,
                  innerRadius,
                  slice.startAngle,
                  slice.endAngle,
                )}
                fill={slice.color}
                className={clsx('slice transition-opacity', {
                  'highlighted-slice': index === info.index,
                })}
              />
            ))}
          </svg>
          <div className="center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="text-sm whitespace-nowrap">{info.title}</div>
            <div className="font-bold text-2xl">{info.value}</div>
            <div className="text-sm text-gray-600">{info.percentage}</div>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full h-full max-h-60 md:max-h-none md:h-60 overflow-auto grow">
          {slices.map((slice, index) => (
            <div
              key={slice.title}
              className="flex items-center gap-5 justify-between pr-2.5"
              onMouseEnter={() => handleMouseEnter(slice, index)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex items-center gap-1">
                <span
                  className="size-6 shrink-0 rounded-sm"
                  style={{ backgroundColor: slice.color }}
                />
                <span>{slice.title}</span>
              </div>
              <div>{formatPercentage(slice.percentage)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

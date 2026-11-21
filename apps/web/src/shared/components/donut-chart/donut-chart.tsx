import { useMemo, useState } from 'react';
import { createSlicePath } from '~/shared/components/donut-chart/helpers/create-slice-path';
import { generateColors } from '~/shared/components/donut-chart/helpers/generate-colors';
import styles from './styles.module.css';
import clsx from 'clsx';

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
    return generateColors(data.length);
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
    <div className={styles.wrapper}>
      {title && <div className={styles.title}>{title}</div>}
      <div className={styles.chart}>
        <div className={styles.chart_container}>
          <svg width={size} height={size} viewBox="0 0 240 240">
            {slices.map((slice, index) => (
              <path
                onMouseEnter={() => handleMouseEnter(slice, index)}
                onMouseLeave={handleMouseLeave}
                key={slice.title}
                d={createSlicePath(120, 120, radius, innerRadius, slice.startAngle, slice.endAngle)}
                fill={slice.color}
                className={clsx(styles.slice, {
                  [styles.highlighted_slice]: index === info.index,
                })}
              />
            ))}
          </svg>
          <div className={styles.info}>
            <div className={styles.info_title}>{info.title}</div>
            <div className={styles.info_value}>{info.value}</div>
            <div className={styles.info_percentage}>{info.percentage}</div>
          </div>
        </div>
        <div className={styles.legend}>
          {slices.map((slice, index) => (
            <div
              key={slice.title}
              className={styles.legend_item}
              onMouseEnter={() => handleMouseEnter(slice, index)}
              onMouseLeave={handleMouseLeave}
            >
              <div className={styles.legend_item_left}>
                <span className={styles.legend_marker} style={{ backgroundColor: slice.color }} />
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

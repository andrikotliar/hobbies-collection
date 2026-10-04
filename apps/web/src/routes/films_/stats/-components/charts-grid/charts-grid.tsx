import styles from './charts-grid.module.css';

type ChartsGridProps = React.PropsWithChildren;

export const ChartsGrid = ({ children }: ChartsGridProps) => {
  return <div className={styles.charts_grid}>{children}</div>;
};

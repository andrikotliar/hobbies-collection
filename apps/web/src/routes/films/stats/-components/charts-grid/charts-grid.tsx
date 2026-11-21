import styles from './styles.module.css';

type Props = React.PropsWithChildren;

export const ChartsGrid = ({ children }: Props) => {
  return <div className={styles.charts_grid}>{children}</div>;
};

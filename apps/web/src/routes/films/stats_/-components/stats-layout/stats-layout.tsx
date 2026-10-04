import styles from './stats-layout.module.css';

type StatsLayoutProps = React.PropsWithChildren;

export const StatsLayout = ({ children }: StatsLayoutProps) => {
  return <div className={styles.page}>{children}</div>;
};

import styles from './styles.module.css';

type Props = React.PropsWithChildren;

export const StatsLayout = ({ children }: Props) => {
  return <div className={styles.page}>{children}</div>;
};

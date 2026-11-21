import styles from './styles.module.css';

export const EventsList = ({ children }: React.PropsWithChildren) => {
  return <div className={styles.events_list}>{children}</div>;
};

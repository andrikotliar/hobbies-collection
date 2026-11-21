import styles from './styles.module.css';

export const MessagesWrapper = ({ children }: React.PropsWithChildren) => {
  return <div className={styles.wrapper}>{children}</div>;
};

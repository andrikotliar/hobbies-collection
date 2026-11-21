import styles from './styles.module.css';

export const ContentWithSidebar = ({ children }: React.PropsWithChildren) => {
  return <div className={styles.wrapper}>{children}</div>;
};

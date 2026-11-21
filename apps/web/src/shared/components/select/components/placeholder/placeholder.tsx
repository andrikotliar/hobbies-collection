import styles from './styles.module.css';

export const Placeholder = ({ children }: React.PropsWithChildren) => {
  return <div className={styles.placeholder}>{children}</div>;
};

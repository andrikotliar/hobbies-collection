import styles from './styles.module.css';

export const Title = ({ children }: React.PropsWithChildren) => {
  return <h1 className={styles.title}>{children}</h1>;
};

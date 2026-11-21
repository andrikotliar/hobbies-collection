import styles from './styles.module.css';

export const LinksGroupWrapper = ({ children }: React.PropsWithChildren) => {
  return <div className={styles.links_group_wrapper}>{children}</div>;
};

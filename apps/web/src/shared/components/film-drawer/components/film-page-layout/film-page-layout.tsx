import styles from './styles.module.css';

export const FilmPageLayout = ({ children }: React.PropsWithChildren) => {
  return <div className={styles.film_page_layout}>{children}</div>;
};

import { HeadContent, Outlet, useSearch } from '@tanstack/react-router';
import { AppNavigation } from './components/app-navigation/app-navigation';
import styles from './styles.module.css';
import { FilmDrawer } from '~/shared/components/film-drawer/film-drawer';

export const Layout = () => {
  const search = useSearch({ from: '__root__' });
  return (
    <>
      <HeadContent />
      <div className={styles.app}>
        <AppNavigation />
        <Outlet />
      </div>
      {search.filmId && <FilmDrawer filmId={search.filmId} />}
    </>
  );
};

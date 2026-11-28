import { HeadContent, Outlet, useSearch } from '@tanstack/react-router';
import { AppNavigation } from './app-navigation';
import { FilmDrawer } from '~/shared/components/drawers/film/film-drawer';

export const GlobalLayout = () => {
  const search = useSearch({ from: '__root__' });
  return (
    <>
      <HeadContent />
      <div className="flex items-start pb-15 md:pb-0 min-h-screen w-full">
        <AppNavigation />
        <Outlet />
      </div>
      {search.filmId && <FilmDrawer filmId={search.filmId} />}
    </>
  );
};

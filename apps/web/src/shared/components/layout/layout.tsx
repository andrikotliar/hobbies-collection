import { HeadContent, Outlet } from '@tanstack/react-router';
import { AppNavigation } from './components';
import styles from './layout.module.css';

export const Layout = () => {
  return (
    <>
      <HeadContent />
      <div className={styles.app}>
        <AppNavigation />
        <Outlet />
      </div>
    </>
  );
};

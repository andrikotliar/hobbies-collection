import styles from './styles.module.css';
import { ConsoleHeader } from './components/console-header/console-header';
import { Outlet } from '@tanstack/react-router';

export const ConsoleRootLayout = () => {
  return (
    <div className={styles.console_layout}>
      <ConsoleHeader />
      <div className={styles.console_content}>
        <Outlet />
      </div>
    </div>
  );
};

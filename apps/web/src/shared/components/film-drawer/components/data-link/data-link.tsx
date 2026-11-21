import { Link } from '@tanstack/react-router';
import { type FileRoutesByTo } from '~/routeTree.gen';
import styles from './styles.module.css';

type Props = {
  basePath: keyof FileRoutesByTo;
  query: { [key: string]: unknown };
  children: React.ReactNode;
};
export const DataLink = ({ basePath, query, children }: Props) => {
  return (
    <Link
      to={basePath}
      search={({ filmId: _, ...rest }) => ({ ...rest, ...query })}
      className={styles.link}
      onClick={() => window.scrollTo(0, 0)}
    >
      {children}
    </Link>
  );
};

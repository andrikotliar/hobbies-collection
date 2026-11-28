import { Link } from '@tanstack/react-router';
import { type FileRoutesByTo } from '~/routeTree.gen';

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
      className="inline-block text-base leading-4 [-webkit-user-drag:none]"
      onClick={() => window.scrollTo(0, 0)}
    >
      {children}
    </Link>
  );
};

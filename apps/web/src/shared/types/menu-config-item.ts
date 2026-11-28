import type { FileRoutesByTo } from '~/routeTree.gen';

export type MenuConfigItem = {
  id: string;
  title: string;
  shortTitle?: string;
  icon: React.ReactNode;
  bg: string;
  color: string;
  route: keyof FileRoutesByTo;
  search?: Record<string, any>;
};

import type { FileRoutesByTo } from '~/routeTree.gen';

export type MenuConfigItem = {
  id: string;
  title: string;
  shortTitle?: string;
  icon: React.ReactNode;
  color: string;
  route: keyof FileRoutesByTo;
  search?: Record<string, any>;
};

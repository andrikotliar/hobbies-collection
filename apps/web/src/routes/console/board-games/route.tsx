import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/console/board-games')({
  component: RouteComponent,
  staticData: {
    title: 'Board Games',
    backPath: '/console',
  },
});

function RouteComponent() {
  return <div>Hello "/console/board-games"!</div>;
}

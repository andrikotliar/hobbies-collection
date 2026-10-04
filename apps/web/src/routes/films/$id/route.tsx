import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/films/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/films/$id"!</div>;
}

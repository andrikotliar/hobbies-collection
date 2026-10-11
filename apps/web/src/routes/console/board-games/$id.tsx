import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/console/board-games/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/console/board-games/$id"!</div>
}

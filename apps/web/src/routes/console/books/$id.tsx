import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/console/books/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/console/books/$id"!</div>
}

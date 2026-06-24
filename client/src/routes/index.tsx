import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Covenant Digital
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Welcome to Covenant Digital. This is the home page — nav bar content is
          managed in the CMS admin panel.
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          Edit the Header collection in the Payload CMS to change navigation links.
        </p>
      </div>
    </div>
  )
}

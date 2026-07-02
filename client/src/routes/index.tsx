import { createFileRoute } from "@tanstack/react-router"
import { useCMSPage } from "@/hooks/server/cms/GET/useCMSPage"
import { RenderBlock } from "@/components/cms/render-block"
import { Skeleton } from "@/components/ui/skeleton"

export const Route = createFileRoute("/")({
  component: HomePage,
})

function HomePage() {
  const { data: page, isLoading, isError } = useCMSPage("home")

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Skeleton className="h-12 w-3/4 mx-auto" />
        <Skeleton className="mt-6 h-6 w-1/2 mx-auto" />
        <Skeleton className="mt-4 h-4 w-1/3 mx-auto" />
      </div>
    )
  }

  if (isError || !page) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Covenant Digital
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Content unavailable
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {page.hero?.richText && (
        <section className="w-full">
          <div className="px-8 text-center">
            <div
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: page.hero.richText }}
            />
          </div>
        </section>
      )}
      {page.layout?.map((block, i) => (
        <RenderBlock key={i} block={block} />
      ))}
    </div>
  )
}

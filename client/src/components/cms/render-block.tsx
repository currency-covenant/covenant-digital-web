import type { CMSBlock } from "shared"
import { ArrowRight } from "lucide-react"

export function RenderBlock({ block }: { block: CMSBlock }) {
  switch (block.blockType) {
    case "cta":
      return <CTABlock block={block} />
    case "content":
      return <ContentBlock block={block} />
    case "mediaBlock":
      return <MediaBlock block={block} />
    case "profile":
      return <ProfileBlock block={block} />
    case "productGrid":
      return <ProductGridBlock block={block} />
    case "workGrid":
      return <WorkGridBlock block={block} />
    default:
      return null
  }
}

function CTABlock({ block }: { block: Extract<CMSBlock, { blockType: "cta" }> }) {
  return (
    <section
      className="relative w-full bg-cover bg-center py-16"
      style={block.backgroundImage?.url ? { backgroundImage: `url(${block.backgroundImage.url})` } : undefined}
    >
      {block.backgroundImage?.url && <div className="absolute inset-0 bg-black/50" />}
      <div className="relative px-8">
        <div
          className="prose prose-invert max-w-none text-center"
          dangerouslySetInnerHTML={{ __html: block.richText }}
        />
        {block.links && block.links.length > 0 && (
          <div className="mt-8 flex flex-col items-center gap-6">
            <div className="flex justify-center">
              <a
                href={block.links[0].link.url ?? "#"}
                className="inline-flex items-center gap-2 rounded-full border border-primary bg-transparent px-6 py-3 text-foreground hover:bg-primary hover:text-background transition-colors"
              >
                {block.links[0].link.label}
                <ArrowRight className="size-4" />
              </a>
            </div>
            {block.links.length > 1 && (
              <div className="flex items-center justify-center gap-4 w-full">
                {block.links.slice(1).map((link, i) => (
                  <a
                    key={i}
                    href={link.link.url ?? "#"}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-primary bg-transparent px-6 py-3 text-foreground hover:bg-primary hover:text-background transition-colors min-w-0"
                  >
                    {link.link.label}
                    <ArrowRight className="size-4 shrink-0" />
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

function ContentBlock({ block }: { block: Extract<CMSBlock, { blockType: "content" }> }) {
  return (
    <section className="w-full py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {block.columns.map((col, i) => (
            <div
              key={i}
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: col.richText }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function MediaBlock({ block }: { block: Extract<CMSBlock, { blockType: "mediaBlock" }> }) {
  if (!block.media?.url) return null
  return (
    <section className="w-full py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <img
          src={block.media.url}
          alt={block.media.alt ?? ""}
          className="h-auto w-full rounded-lg object-cover"
        />
      </div>
    </section>
  )
}

function ProfileBlock({ block }: { block: Extract<CMSBlock, { blockType: "profile" }> }) {
  return (
    <section className="w-full py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 text-center">
          {block.profileImage?.url && (
            <img
              src={block.profileImage.url}
              alt={block.profileImage.alt ?? ""}
              className="size-32 rounded-full object-cover"
            />
          )}
          <h2 className="text-3xl font-bold">{block.name}</h2>
          {block.description && (
            <p className="max-w-2xl text-muted-foreground">{block.description}</p>
          )}
        </div>
      </div>
    </section>
  )
}

function ProductGridBlock({ block }: { block: Extract<CMSBlock, { blockType: "productGrid" }> }) {
  return (
    <section className="w-full py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {block.items.map((item, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 rounded-lg border border-border p-6"
            >
              {item.iconImage?.url && (
                <img
                  src={item.iconImage.url}
                  alt={item.iconImage.alt ?? ""}
                  className="size-12 object-contain"
                />
              )}
              <div>
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </div>
              {item.projectLink && (
                <a
                  href={item.projectLink}
                  className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  View project <ArrowRight className="size-3" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function WorkGridBlock({ block }: { block: Extract<CMSBlock, { blockType: "workGrid" }> }) {
  return (
    <section className="w-full py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          {block.items.map((item, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 rounded-lg border border-border p-6"
            >
              {item.iconImage?.url && (
                <img
                  src={item.iconImage.url}
                  alt={item.iconImage.alt ?? ""}
                  className="size-12 object-contain"
                />
              )}
              <div>
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </div>
              <div className="mt-auto flex gap-3">
                {item.projectLink && (
                  <a
                    href={item.projectLink}
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    Visit <ArrowRight className="size-3" />
                  </a>
                )}
                {item.repoLink && (
                  <a
                    href={item.repoLink}
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Source <ArrowRight className="size-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

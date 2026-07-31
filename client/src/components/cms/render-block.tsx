import type { CMSBlock, CMSLink, CMSMarqueeItem, CMSTechStackItem } from "shared";
import { ArrowRight } from "lucide-react";
import * as SiIcons from "react-icons/si";
import { Marquee } from "@/components/ui/marquee";
import { useInView } from "@/hooks/useInView";

export function RenderBlock({ block }: { block: CMSBlock }) {
  switch (block.blockType) {
    case "cta":
      return <CTABlock block={block} />;
    case "ctaButton":
      return <CTAButtonBlock block={block} />;
    case "content":
      return <ContentBlock block={block} />;
    case "mediaBlock":
      return <MediaBlock block={block} />;
    case "profile":
      return <ProfileBlock block={block} />;
    case "productGrid":
      return <ProductGridBlock block={block} />;
    case "workGrid":
      return <WorkGridBlock block={block} />;
    case "marquee":
      return <MarqueeBlock block={block} />;
    case "linkList":
      return <LinkListBlock block={block} />;
    case "techStack":
      return <TechStackBlock block={block} />;
    default:
      return null;
  }
}

function CTALinkAnchor({
  link,
  className = "inline-flex items-center gap-2 rounded-full border border-primary bg-transparent px-6 py-3 text-foreground hover:bg-primary hover:text-background transition-colors",
}: {
  link: CMSLink;
  className?: string;
}) {
  const href = link.url ?? "#";
  const isHash = href.startsWith("#");

  return (
    <a
      href={href}
      target={!isHash && link.newTab ? "_blank" : undefined}
      rel={!isHash && link.newTab ? "noopener noreferrer" : undefined}
      className={className}
    >
      {link.label}
      <ArrowRight className="size-4 shrink-0" />
    </a>
  );
}

export function CTAButton({
  link,
}: {
  link: CMSLink;
}) {
  const href = link.url ?? "#";
  const isHash = href.startsWith("#");

  return (
    <>
      <style>{`
        .hero-btn-glow {
          align-items: center;
          appearance: none;
          background-clip: padding-box;
          background-color: initial;
          background-image: none;
          border-style: none;
          box-sizing: border-box;
          color: var(--primary-foreground);
          cursor: pointer;
          display: inline-flex;
          flex-direction: row;
          flex-shrink: 0;
          font-family: Eina01, sans-serif;
          font-size: 16px;
          font-weight: 800;
          justify-content: center;
          line-height: 24px;
          margin: 0;
          min-height: 64px;
          outline: none;
          overflow: visible;
          padding: 19px 26px;
          pointer-events: auto;
          position: relative;
          text-align: center;
          text-decoration: none;
          text-transform: none;
          user-select: none;
          -webkit-user-select: none;
          touch-action: manipulation;
          vertical-align: middle;
          width: auto;
          word-break: keep-all;
          z-index: 0;
        }
        @media (min-width: 768px) {
          .hero-btn-glow {
            padding: 19px 32px;
          }
        }
        .hero-btn-glow::before,
        .hero-btn-glow::after {
          border-radius: 80px;
        }
        .hero-btn-glow::before {
          background-image: linear-gradient(92.83deg, var(--accent) 0, var(--primary) 100%);
          content: "";
          display: block;
          height: 100%;
          left: 0;
          overflow: hidden;
          position: absolute;
          top: 0;
          width: 100%;
          z-index: -2;
        }
        .hero-btn-glow::after {
          background-color: initial;
          background-image: linear-gradient(var(--muted) 0, var(--background) 100%);
          bottom: 4px;
          content: "";
          display: block;
          left: 4px;
          overflow: hidden;
          position: absolute;
          right: 4px;
          top: 4px;
          transition: all 100ms ease-out;
          z-index: -1;
        }
        .hero-btn-glow:hover::after {
          bottom: 0;
          left: 0;
          right: 0;
          top: 0;
          transition-timing-function: ease-in;
          opacity: 0;
        }
        .hero-btn-glow:active {
          color: var(--muted-foreground);
        }
      `}</style>
      <a
        href={href}
        target={!isHash && link.newTab ? "_blank" : undefined}
        rel={!isHash && link.newTab ? "noopener noreferrer" : undefined}
        className="hero-btn-glow"
      >
        {link.label}
        <ArrowRight className="size-6 shrink-0" />
      </a>
    </>
  )
}

function CTAButtonBlock({
  block,
}: {
  block: Extract<CMSBlock, { blockType: "ctaButton" }>;
}) {
  const link = block.link
  const hasUrl = Boolean(link?.url)

  return (
    <section className="w-full py-16">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        {hasUrl && link ? (
          <CTAButton link={link} />
        ) : (
          <span className="text-sm text-muted-foreground">
            {link?.label ? link.label : "CTA link missing"}
          </span>
        )}
      </div>
    </section>
  );
}

function CTABlock({
  block,
}: {
  block: Extract<CMSBlock, { blockType: "cta" }>;
}) {
  return (
    <section
      className="relative w-full bg-cover bg-center py-16"
      style={
        block.backgroundImage?.url
          ? { backgroundImage: `url(${block.backgroundImage.url})` }
          : undefined
      }
    >
      {block.backgroundImage?.url && (
        <div className="absolute inset-0 bg-black/50" />
      )}
      <div className="relative px-8">
        <div
          className="prose prose-invert max-w-none text-center"
          dangerouslySetInnerHTML={{ __html: block.richText }}
        />
        {block.links && block.links.length > 0 && (
          <div className="mt-8 flex w-full flex-col items-center gap-6">
            <div className="flex justify-center w-full">
              <CTALinkAnchor link={block.links[0].link} />
            </div>
            {block.links.length > 1 && (
              <div className="flex items-center justify-center gap-4 w-full">
                {block.links.slice(1).map((link, i) => (
                  <CTALinkAnchor key={i} link={link.link} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function ContentBlock({
  block,
}: {
  block: Extract<CMSBlock, { blockType: "content" }>;
}) {
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
  );
}

function MediaBlock({
  block,
}: {
  block: Extract<CMSBlock, { blockType: "mediaBlock" }>;
}) {
  if (!block.media?.url) return null;
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
  );
}

function ProfileBlock({
  block,
}: {
  block: Extract<CMSBlock, { blockType: "profile" }>;
}) {
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
            <p className="max-w-2xl text-muted-foreground">
              {block.description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function ProductGridBlock({
  block,
}: {
  block: Extract<CMSBlock, { blockType: "productGrid" }>;
}) {
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
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
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
  );
}

function WorkGridBlock({
  block,
}: {
  block: Extract<CMSBlock, { blockType: "workGrid" }>;
}) {
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
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
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
  );
}

/* ------------------------------------------------------------------ */
/*  Marquee                                                           */
/* ------------------------------------------------------------------ */

const iconMap: Record<string, React.ComponentType<{ size?: number; title?: string; className?: string }>> =
  SiIcons as unknown as Record<string, React.ComponentType<{ size?: number; title?: string; className?: string }>>

function resolveIcon(slug: string | null | undefined) {
  if (!slug) return null
  // react-icons/si exports components like SiReact, SiNextdotjs, etc.
  const key = `Si${slug.charAt(0).toUpperCase() + slug.slice(1)}`
  return iconMap[key] ?? null
}

function MarqueeItem({ item }: { item: CMSMarqueeItem }) {
  const { title, icon, uploadIcon } = item
  const IconComponent = !uploadIcon?.url && icon ? resolveIcon(icon) : null

  return (
    <span className="inline-flex items-center px-6 text-foreground">
      {uploadIcon?.url ? (
        <img
          src={uploadIcon.url}
          alt={uploadIcon.alt ?? title}
          width={48}
          height={48}
          className="size-20 object-contain"
        />
      ) : IconComponent ? (
        <IconComponent size={72} title={title} className="text-background" />
      ) : null}
    </span>
  )
}

function MarqueeBlock({
  block,
}: {
  block: Extract<CMSBlock, { blockType: "marquee" }>;
}) {
  if (!block.items || block.items.length === 0) return null

  return (
    <section className="relative w-full bg-foreground my-32 h-full">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-40 bg-gradient-to-r from-foreground to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-40 bg-gradient-to-l from-foreground to-transparent" />
      <Marquee pauseOnHover className="[--duration:30s] [--gap:4rem]">
        {block.items.map((item, i) => (
          <MarqueeItem key={i} item={item} />
        ))}
      </Marquee>
    </section>
  )
}

function LinkListItemAnchor({
  link,
  children,
  className,
}: {
  link: CMSLink
  children: React.ReactNode
  className?: string
}) {
  const href = link.url ?? "#"
  const isHash = href.startsWith("#")

  return (
    <a
      href={href}
      target={!isHash && link.newTab ? "_blank" : undefined}
      rel={!isHash && link.newTab ? "noopener noreferrer" : undefined}
      className={className}
    >
      {children}
    </a>
  )
}

function LinkListBlock({
  block,
}: {
  block: Extract<CMSBlock, { blockType: "linkList" }>;
}) {
  const { ref, isInView } = useInView<HTMLElement>({ threshold: 0.1 })

  if (!block.links || block.links.length === 0) return null

  return (
    <section ref={ref} className="w-full flex justify-center py-16">
      <div className="max-w-screen-2xl w-full px-4 sm:px-6 lg:px-8 ">
        {block.title && (
          <h2 className="mb-16 text-5xl whitespace-nowrap font-bold tracking-tight text-foreground ">
            {block.title}
          </h2>
        )}
                  <div className="h-12 w-full bg-background " />
        <div className="grid gap-8">
          {block.links.map((item, i) => (
            <div
              key={item.id ?? i}
              className={
                "transition-all duration-300 ease-out " +
                (isInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6")
              }
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="flex flex-col items-start justify-between gap-20 p-16 sm:flex-row sm:items-center">
                <div className="flex items-baseline gap-3 text-2xl font-semibold sm:flex-1 sm:min-w-0">
                  <span className="select-none text-xl text-muted-foreground">{i + 1}.</span>
                  {item.link.url ? (
                    <LinkListItemAnchor
                      link={item.link}
                      className="text-foreground transition-colors hover:text-primary"
                    >
                      {item.title}
                    </LinkListItemAnchor>
                  ) : (
                    <span className="text-foreground">
                      {item.title}
                    </span>
                  )}
                </div>
                <p className="text-base md:text-lg text-foreground sm:w-96 md:w-2/4 sm:shrink-0 sm:text-left">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function parseDevicon(devicon?: string | null): { name: string; logoStyle: string } | null {
  if (!devicon) return null
  const parts = devicon.trim().split(/\s+/)
  const classToken = parts.find((p) => p.startsWith("devicon-")) ?? parts[0]
  if (!classToken) return null
  const withoutPrefix = classToken.replace("devicon-", "")
  const segments = withoutPrefix.split("-")
  if (segments.length < 2) return null
  const logoStyle = segments.pop()!
  const name = segments.join("-")
  return { name, logoStyle }
}

function TechStackItem({ item }: { item: CMSTechStackItem }) {
  const { title, icon, devicon, uploadIcon } = item
  const IconComponent = !uploadIcon?.url && !devicon && icon ? resolveIcon(icon) : null
  const deviconProps = parseDevicon(devicon)

  return (
    <div className="flex flex-col items-center gap-2 text-center text-background">
      <div className="flex h-16 items-center justify-center">
        {uploadIcon?.url ? (
          <img
            src={uploadIcon.url}
            alt={uploadIcon.alt ?? title}
            width={40}
            height={40}
            className="size-10 object-contain"
          />
        ) : deviconProps ? (
          <img
            src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${deviconProps.name}/${deviconProps.name}-${deviconProps.logoStyle}.svg`}
            alt={title}
            width={40}
            height={40}
            className="size-10 object-contain"
          />
        ) : IconComponent ? (
          <IconComponent size={40} title={title} className="text-background" />
        ) : null}
      </div>
      <span className="text-base font-medium">{title}</span>
    </div>
  )
}

function TechStackBlock({
  block,
}: {
  block: Extract<CMSBlock, { blockType: "techStack" }>;
}) {
  if (!block.items || block.items.length === 0) return null

  const rows = block.items.reduce<Record<number, CMSTechStackItem[]>>((acc, item) => {
    const row = item.row ?? 1
    if (!acc[row]) acc[row] = []
    acc[row].push(item)
    return acc
  }, {})

  const sortedRowNumbers = Object.keys(rows)
    .map(Number)
    .sort((a, b) => a - b)

  return (
    <section className="w-full flex flex-col justify-center items-center bg-foreground py-16">
                        <div className="h-8 w-full bg-foreground" />
      <div className="mx-auto  px-4 sm:px-6 lg:px-8">
        {block.title && (
          <h2 className=" text-6xl font-bold tracking-tight text-background flex justify-center">
            {block.title}
          </h2>
        )}
                  <div className="h-8 w-full bg-foreground" />
        {block.description && (
          <p className="mb-8 text-2xl text-background flex justify-center text-center max-w-screen-2xl w-full">
            {block.description}
          </p>
        )}
                          <div className="h-12 w-full bg-foreground" />
        <div className="flex flex-col items-center justify-center gap-16 divide-y divide-background/20">
          {sortedRowNumbers.map((rowNumber) => (
            <div
              key={rowNumber}
              className="grid grid-cols-2 gap-16 md:grid-cols-4 lg:grid-cols-6"
            >
              {rows[rowNumber].map((item, i) => (
                <TechStackItem key={item.id ?? i} item={item} />
              ))}
            </div>
          ))}
        </div>
      </div>
                        <div className="h-8 w-full bg-foreground" />
    </section>
  )
}

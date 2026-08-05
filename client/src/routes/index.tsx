import { createFileRoute } from "@tanstack/react-router";
import { useCMSPage } from "@/hooks/server/cms/GET/useCMSPage";
import { RenderBlock, CTAButton } from "@/components/cms/render-block";
import { Skeleton } from "@/components/ui/skeleton";
import type { CMSBlock, CMSCTAButtonBlock, CMSLinkListBlock, CMSMarqueeBlock } from "shared";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const { data: page, isLoading, isError } = useCMSPage("home");

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Skeleton className="h-12 w-3/4 mx-auto" />
        <Skeleton className="mt-6 h-6 w-1/2 mx-auto" />
        <Skeleton className="mt-4 h-4 w-1/3 mx-auto" />
      </div>
    );
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
    );
  }

  // eslint-disable-next-line no-console
  console.log("CMS home page:", page);

  const layout = page.layout ?? [];
  const heroCtaButtons: CMSCTAButtonBlock[] = [];
  const remainingBlocks: CMSBlock[] = [];
  let marqueeBlock: CMSMarqueeBlock | null = null;
  let linkListBlock: CMSLinkListBlock | null = null;

  let collectingHeroCtas = true;
  for (const block of layout) {
    if (collectingHeroCtas && block.blockType === "ctaButton") {
      heroCtaButtons.push(block as CMSCTAButtonBlock);
    } else if (!marqueeBlock && block.blockType === "marquee") {
      collectingHeroCtas = false;
      marqueeBlock = block as CMSMarqueeBlock;
    } else if (!linkListBlock && block.blockType === "linkList") {
      collectingHeroCtas = false;
      linkListBlock = block as CMSLinkListBlock;
    } else {
      collectingHeroCtas = false;
      remainingBlocks.push(block);
    }
  }

  const heroRichText = page.hero?.richText ?? "";
  const hasHeroContent = heroRichText.length > 0;
  const hasHeroCtas = heroCtaButtons.length > 0;

  return (
    <div>
      {(hasHeroContent || hasHeroCtas) && (
        <div
          style={{ paddingTop: "120px", paddingBottom: "120px" }}
          className="w-full flex justify-center bg-background px-8"
        >
          <section className="mx-auto flex w-full max-w-screen-2xl flex-col items-center py-16">
            {hasHeroContent && (
              <div
                className="prose prose-invert prose-2xl w-full max-w-none! text-left"
                dangerouslySetInnerHTML={{ __html: heroRichText }}
              />
            )}
            {hasHeroCtas && (
              <div style={{paddingTop: "32px"}} className=" flex w-full items-center justify-start gap-6">
                {heroCtaButtons.map((block, i) => (
                  <CTAButton key={i} link={block.link} />
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {marqueeBlock && (
        <>
          <div className="h-16 w-full bg-foreground " />
          <RenderBlock block={marqueeBlock} />
          <div className="h-16 w-full bg-foreground " />
        </>
      )}
          <div className="h-16 w-full bg-background" />
      {linkListBlock && (
        <>
        <RenderBlock block={linkListBlock} />
                  <div className="h-16 w-full bg-background " />
        </>
                  )}
      {remainingBlocks.map((block, i) => (
        <RenderBlock key={i} block={block} />
      ))}
                              <div className="h-16 w-full bg-background" />
    </div>
  );
}

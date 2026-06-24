import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, ChevronRight, Menu, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { useHeader } from "@/hooks/server/cms/GET/useHeader";
import type { CMSNavLink } from "shared";
import { cn } from "@/lib/utils";

function isExternal(url: string): boolean {
  return url.startsWith("http");
}

function NavLinkAnchor({
  label,
  url,
  newTab,
  className,
}: {
  label: string;
  url: string;
  newTab?: boolean | null;
  className?: string;
}) {
  if (isExternal(url)) {
    return (
      <a
        href={url}
        target={newTab ? "_blank" : undefined}
        rel={newTab ? "noopener noreferrer" : undefined}
        className={className}
      >
        {label}
      </a>
    );
  }
  return (
    <Link to={url} target={newTab ? "_blank" : undefined} className={className}>
      {label}
    </Link>
  );
}

function hasChildren(navLink: CMSNavLink): boolean {
  return Boolean(navLink.children && navLink.children.length > 0);
}

/* ── Desktop: Level 3 (sub-flyout inside a dropdown) ── */

function DesktopSubItem({ navLink }: { navLink: CMSNavLink }) {
  const { link } = navLink;
  const hasSubs = hasChildren(navLink);

  if (!hasSubs) {
    if (!link.url || !link.label) return null;
    return (
      <NavLinkAnchor
        label={link.label}
        url={link.url}
        newTab={link.newTab}
        className="block rounded-md px-3 py-2 text-base text-foreground hover:bg-muted hover:underline transition-colors"
      />
    );
  }

  return (
    <div className="group/sub relative">
      <div className="flex items-center justify-between rounded-md px-3 py-2 text-base text-foreground hover:bg-muted hover:underline transition-colors">
        {link.url ? (
          <NavLinkAnchor
            label={link.label}
            url={link.url}
            newTab={link.newTab}
            className="flex-1 text-foreground hover:underline underline-offset-4"
          />
        ) : (
          <span className="flex-1">{link.label}</span>
        )}
        <ChevronRight className="ml-2 size-3.5 shrink-0" />
      </div>
      <div className="invisible absolute left-full top-0 z-50 ml-1 min-w-[16rem] rounded-md border border-border bg-popover/70 backdrop-blur-xl p-1 opacity-0 shadow-md transition-all group-hover/sub:visible group-hover/sub:opacity-100">
        {navLink.children!.map((child) => {
          const childLink = child.link;
          if (!childLink.url || !childLink.label) return null;
          return (
            <NavLinkAnchor
              key={child.id ?? childLink.label}
              label={childLink.label}
              url={childLink.url}
              newTab={childLink.newTab}
              className="block rounded-md px-3 py-2 text-base text-foreground hover:bg-muted hover:underline transition-colors"
            />
          );
        })}
      </div>
    </div>
  );
}

/* ── Desktop: Level 2 (dropdown panel under a top-level item) ── */

function DesktopDropdownItem({ navLink }: { navLink: CMSNavLink }) {
  const { link } = navLink;
  const hasSubs = hasChildren(navLink);

  if (!hasSubs) {
    if (!link.url || !link.label) return null;
    return (
      <NavLinkAnchor
        label={link.label}
        url={link.url}
        newTab={link.newTab}
        className="block rounded-md px-3 py-2 mx-8 text-2xl text-foreground w-full hover:bg-muted hover:underline transition-colors"
      />
    );
  }

  return (
    <div className="group/sub relative">
      <div className="flex items-center justify-between rounded-md px-3 py-2 text-base text-red-500 hover:bg-muted hover:underline transition-colors">
        {link.url ? (
          <NavLinkAnchor
            label={link.label}
            url={link.url}
            newTab={link.newTab}
            className="flex-1 text-foreground hover:underline underline-offset-4"
          />
        ) : (
          <span className="flex-1">{link.label}</span>
        )}
        <ChevronRight className="ml-2 size-3.5 shrink-0" />
      </div>
      <div className="invisible absolute left-full top-0 z-50 ml-1 min-w-[12rem] rounded-md border border-border bg-popover/70 backdrop-blur-xl p-1 opacity-0 shadow-md transition-all group-hover/sub:visible group-hover/sub:opacity-100">
        {navLink.children!.map((child) => (
          <DesktopSubItem key={child.id ?? child.link.label} navLink={child} />
        ))}
      </div>
    </div>
  );
}

/* ── Desktop: Level 1 (top-level horizontal nav) ── */

function DesktopNavItem({ navLink }: { navLink: CMSNavLink }) {
  const { link } = navLink;
  const hasSubs = hasChildren(navLink);

  if (!hasSubs) {
    if (!link.url || !link.label) return null;
    return (
      <NavLinkAnchor
        label={link.label}
        url={link.url}
        newTab={link.newTab}
        className="text-2xl font-medium text-foreground underline-offset-4 hover:underline transition-colors whitespace-nowrap"
      />
    );
  }

  return (
    <div className="group relative">
      <div className="flex items-center gap-1 text-lg font-bold text-foreground underline-offset-4 hover:underline transition-colors cursor-default whitespace-nowrap">
        {link.url ? (
          <NavLinkAnchor
            label={link.label}
            url={link.url}
            newTab={link.newTab}
            className="text-foreground hover:underline underline-offset-4"
          />
        ) : (
          <span>{link.label}</span>
        )}
        <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180" />
      </div>
      <div className="invisible absolute left-0 top-8 z-50 mt-1 min-w-[12rem] ml-8 rounded-md border border-border bg-popover/70 backdrop-blur-xl p-1 opacity-0 shadow-md transition-all group-hover:visible group-hover:opacity-100">
        {navLink.children!.map((child) => (
          <DesktopDropdownItem
            key={child.id ?? child.link.label}
            navLink={child}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Mobile: collapsible recursive item ── */

function MobileNavItem({
  navLink,
  level,
}: {
  navLink: CMSNavLink;
  level: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const { link } = navLink;
  const hasSubs = hasChildren(navLink);

  if (!hasSubs) {
    if (!link.url || !link.label) return null;
    return (
      <div style={{ paddingLeft: `${level * 12}px` }}>
        <NavLinkAnchor
          label={link.label}
          url={link.url}
          newTab={link.newTab}
          className="block py-2 text-sm text-foreground hover:underline underline-offset-4 transition-colors"
        />
      </div>
    );
  }

  return (
    <div style={{ paddingLeft: `${level * 12}px` }}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between py-2 text-sm font-medium text-foreground"
      >
        <span>{link.label}</span>
        <ChevronDown
          className={cn(
            "size-4 transition-transform",
            expanded && "rotate-180",
          )}
        />
      </button>
      {expanded && (
        <div className="pb-1">
          {navLink.children!.map((child) => (
            <SheetClose
              key={child.id ?? child.link.label}
              render={<MobileNavItem navLink={child} level={level + 1} />}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main Navbar ── */

export function Navbar() {
  const { data: header, isLoading, isError } = useHeader();

  const navLinks = header?.navLinks ?? [];

  return (
    <header className="sticky px-8 top-0 flex justify-center items-center w-full border-b border-white/[3%] bg-background/70 backdrop-blur-xl shadow-lg">
      <div className="flex h-16 items-center gap-4 mx-auto max-w-screen-2xl w-full">
        {/* Left 1/3: Logo */}
        <div className="flex items-center shrink-0">
          {header?.logo?.url ? (
            <Link to="/">
              <img
                src={header.logo.url}
                alt={header.logo.alt ?? "Logo"}
                className="h-14 w-auto object-contain"
              />
            </Link>
          ) : null}
        </div>

        <nav className="hidden md:flex items-center justify-center gap-6 flex-1">
          {isLoading ? (
            <>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </>
          ) : isError ? (
            <span className="text-sm text-muted-foreground">
              Nav unavailable
            </span>
          ) : navLinks.length === 0 ? (
            <span className="text-sm text-muted-foreground">
              No nav configured
            </span>
          ) : (
            navLinks.map((navLink) => (
              <DesktopNavItem
                key={navLink.id ?? navLink.link.label}
                navLink={navLink}
              />
            ))
          )}
        </nav>
        <div className="hidden md:block shrink-0">
          <a
            href="/contact"
            className="rounded-full text-xl h-8 w-32 px-8 py-3 border border-primary bg-transparent text-foreground hover:bg-primary hover:text-background inline-flex items-center justify-center whitespace-nowrap gap-2"
          >
            Contact
            <ArrowRight className="size-5" />
          </a>
        </div>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon">
                  <Menu className="size-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              }
            />
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col px-4">
                {isLoading ? (
                  <>
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                  </>
                ) : (
                  navLinks.map((navLink) => (
                    <MobileNavItem
                      key={navLink.id ?? navLink.link.label}
                      navLink={navLink}
                      level={0}
                    />
                  ))
                )}
              </nav>
              <div className="mt-4 border-t border-border px-4 pt-4">
                <SheetClose
                  render={
                    <a
                      href="/contact"
                      className="block w-full rounded-full border border-primary bg-transparent text-primary py-4 px-8 text-center font-medium whitespace-nowrap"
                    >
                      Contact
                      <ArrowRight className="size-5 inline-block ml-2" />
                    </a>
                  }
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

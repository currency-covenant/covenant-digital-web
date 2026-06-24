import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { ChevronDown, ChevronRight, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import { useHeader } from "@/hooks/server/cms/GET/useHeader"
import type { CMSNavLink } from "shared"
import { cn } from "@/lib/utils"

function isExternal(url: string): boolean {
  return url.startsWith("http")
}

function NavLinkAnchor({
  label,
  url,
  newTab,
  className,
}: {
  label: string
  url: string
  newTab?: boolean | null
  className?: string
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
    )
  }
  return (
    <Link to={url} target={newTab ? "_blank" : undefined} className={className}>
      {label}
    </Link>
  )
}

function hasChildren(navLink: CMSNavLink): boolean {
  return Boolean(navLink.children && navLink.children.length > 0)
}

/* ── Desktop: Level 3 (sub-flyout inside a dropdown) ── */

function DesktopSubItem({ navLink }: { navLink: CMSNavLink }) {
  const { link } = navLink
  const hasSubs = hasChildren(navLink)

  if (!hasSubs) {
    if (!link.url || !link.label) return null
    return (
      <NavLinkAnchor
        label={link.label}
        url={link.url}
        newTab={link.newTab}
        className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      />
    )
  }

  return (
    <div className="group/sub relative">
      <div className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
        {link.url ? (
          <NavLinkAnchor
            label={link.label}
            url={link.url}
            newTab={link.newTab}
            className="flex-1 text-muted-foreground hover:text-foreground"
          />
        ) : (
          <span className="flex-1">{link.label}</span>
        )}
        <ChevronRight className="ml-2 size-3.5 shrink-0" />
      </div>
      <div className="invisible absolute left-full top-0 z-50 ml-1 min-w-[12rem] rounded-md border border-border bg-popover p-1 opacity-0 shadow-md transition-all group-hover/sub:visible group-hover/sub:opacity-100">
        {navLink.children!.map((child) => {
          const childLink = child.link
          if (!childLink.url || !childLink.label) return null
          return (
            <NavLinkAnchor
              key={child.id ?? childLink.label}
              label={childLink.label}
              url={childLink.url}
              newTab={childLink.newTab}
              className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            />
          )
        })}
      </div>
    </div>
  )
}

/* ── Desktop: Level 2 (dropdown panel under a top-level item) ── */

function DesktopDropdownItem({ navLink }: { navLink: CMSNavLink }) {
  const { link } = navLink
  const hasSubs = hasChildren(navLink)

  if (!hasSubs) {
    if (!link.url || !link.label) return null
    return (
      <NavLinkAnchor
        label={link.label}
        url={link.url}
        newTab={link.newTab}
        className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      />
    )
  }

  return (
    <div className="group/sub relative">
      <div className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
        {link.url ? (
          <NavLinkAnchor
            label={link.label}
            url={link.url}
            newTab={link.newTab}
            className="flex-1 text-muted-foreground hover:text-foreground"
          />
        ) : (
          <span className="flex-1">{link.label}</span>
        )}
        <ChevronRight className="ml-2 size-3.5 shrink-0" />
      </div>
      <div className="invisible absolute left-full top-0 z-50 ml-1 min-w-[12rem] rounded-md border border-border bg-popover p-1 opacity-0 shadow-md transition-all group-hover/sub:visible group-hover/sub:opacity-100">
        {navLink.children!.map((child) => (
          <DesktopSubItem key={child.id ?? child.link.label} navLink={child} />
        ))}
      </div>
    </div>
  )
}

/* ── Desktop: Level 1 (top-level horizontal nav) ── */

function DesktopNavItem({ navLink }: { navLink: CMSNavLink }) {
  const { link } = navLink
  const hasSubs = hasChildren(navLink)

  if (!hasSubs) {
    if (!link.url || !link.label) return null
    return (
      <NavLinkAnchor
        label={link.label}
        url={link.url}
        newTab={link.newTab}
        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      />
    )
  }

  return (
    <div className="group relative">
      <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-default">
        {link.url ? (
          <NavLinkAnchor
            label={link.label}
            url={link.url}
            newTab={link.newTab}
            className="text-muted-foreground hover:text-foreground"
          />
        ) : (
          <span>{link.label}</span>
        )}
        <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180" />
      </div>
      <div className="invisible absolute left-0 top-full z-50 mt-1 min-w-[12rem] rounded-md border border-border bg-popover p-1 opacity-0 shadow-md transition-all group-hover:visible group-hover:opacity-100">
        {navLink.children!.map((child) => (
          <DesktopDropdownItem key={child.id ?? child.link.label} navLink={child} />
        ))}
      </div>
    </div>
  )
}

/* ── Mobile: collapsible recursive item ── */

function MobileNavItem({ navLink, level }: { navLink: CMSNavLink; level: number }) {
  const [expanded, setExpanded] = useState(false)
  const { link } = navLink
  const hasSubs = hasChildren(navLink)

  if (!hasSubs) {
    if (!link.url || !link.label) return null
    return (
      <div style={{ paddingLeft: `${level * 12}px` }}>
        <NavLinkAnchor
          label={link.label}
          url={link.url}
          newTab={link.newTab}
          className="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        />
      </div>
    )
  }

  return (
    <div style={{ paddingLeft: `${level * 12}px` }}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between py-2 text-sm font-medium text-foreground"
      >
        <span>{link.label}</span>
        <ChevronDown
          className={cn("size-4 transition-transform", expanded && "rotate-180")}
        />
      </button>
      {expanded && (
        <div className="pb-1">
          {navLink.children!.map((child) => (
            <SheetClose
              key={child.id ?? child.link.label}
              render={
                <MobileNavItem navLink={child} level={level + 1} />
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Main Navbar ── */

export function Navbar() {
  const { data: header, isLoading, isError } = useHeader()

  const navLinks = header?.navLinks ?? []

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Link to="/" className="text-xl font-bold tracking-tight">
            Covenant Digital
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {isLoading ? (
            <>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </>
          ) : isError ? (
            <span className="text-sm text-muted-foreground">Nav unavailable</span>
          ) : navLinks.length === 0 ? (
            <span className="text-sm text-muted-foreground">No nav configured</span>
          ) : (
            navLinks.map((navLink) => (
              <DesktopNavItem
                key={navLink.id ?? navLink.link.label}
                navLink={navLink}
              />
            ))
          )}
        </nav>

        {/* Mobile nav */}
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
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

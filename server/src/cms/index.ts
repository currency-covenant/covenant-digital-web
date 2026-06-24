import { Hono } from "hono"
import type { CMSHeader, CMSNavLink } from "shared"

function env(c: { env?: Record<string, unknown> }, key: string): string | undefined {
  return (c.env?.[key] as string | undefined) || process.env[key]
}

type CMSEnv = {
  Bindings: {
    CMS_URL: string
    CMS_TENANT_ID: string
  }
}

export const cmsRoutes = new Hono<CMSEnv>()

function resolveLinkUrl(
  linkData: Record<string, unknown>,
): { url: string | null; label: string; newTab: boolean } {
  const label = (linkData.label as string) ?? ""
  const newTab = Boolean(linkData.newTab)
  const linkType = (linkData.type as string) ?? "custom"

  if (linkType === "reference") {
    const reference = linkData.reference as Record<string, unknown> | undefined
    if (reference) {
      const refSlug = (reference.slug as string) ?? null
      const refCollectionSlug = (reference.collectionSlug as string) ?? null
      if (refSlug) {
        const prefix = refCollectionSlug === "posts" ? "/blog" : ""
        return { url: `${prefix}/${refSlug}`, label, newTab }
      }
    }
    return { url: null, label, newTab }
  }

  const url = (linkData.url as string) ?? null
  return { url, label, newTab }
}

function mapNavLink(item: Record<string, unknown>): CMSNavLink {
  const linkData = (item.link as Record<string, unknown> | undefined) ?? {}
  const resolved = resolveLinkUrl(linkData)
  const linkType = (linkData.type as "reference" | "custom") ?? null

  const childrenRaw = (item.children as Record<string, unknown>[] | undefined) ?? []
  const children: CMSNavLink[] | null =
    childrenRaw.length > 0 ? childrenRaw.map((child) => mapNavLink(child)) : null

  return {
    id: (item.id as string) ?? null,
    link: {
      type: linkType,
      newTab: resolved.newTab,
      url: resolved.url,
      label: resolved.label,
    },
    children,
  }
}

cmsRoutes.get("/header", async (c) => {
  const cmsUrl = env(c, "CMS_URL")
  const tenantId = env(c, "CMS_TENANT_ID")

  if (!cmsUrl) {
    return c.json({ error: "CMS_URL not configured" }, 500)
  }
  if (!tenantId) {
    return c.json({ error: "CMS_TENANT_ID not configured" }, 500)
  }

  const url = `${cmsUrl}/api/header?depth=4&where[tenant][equals]=${encodeURIComponent(tenantId)}&limit=1`

  let res: Response
  try {
    res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
    })
  } catch {
    return c.json({ error: "CMS unreachable" }, 502)
  }

  if (!res.ok) {
    return c.json({ error: "CMS fetch failed" }, res.status as any)
  }

  const json = (await res.json()) as { docs?: Record<string, unknown>[] }
  const doc = json.docs?.[0]
  if (!doc) {
    return c.json(null)
  }

  const navLinksRaw = (doc.navLinks as Record<string, unknown>[] | undefined) ?? []

  const header: CMSHeader = {
    id: doc.id as number,
    title: (doc.title as string) ?? "",
    navLinks: navLinksRaw.map((item) => mapNavLink(item)),
  }

  return c.json(header)
})

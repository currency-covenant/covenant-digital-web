import { Hono } from "hono"
import type { CMSHeader, CMSMedia, CMSNavLink } from "shared"
import { lexicalToHTML } from "./lexical-to-html"

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

function convertRichTextFields(
  obj: Record<string, unknown>,
  baseUrl: string = "",
): Record<string, unknown> {
  if (Array.isArray(obj)) {
    return obj.map((item) =>
      typeof item === "object" && item !== null
        ? convertRichTextFields(item as Record<string, unknown>, baseUrl)
        : item,
    ) as unknown as Record<string, unknown>
  }

  if (obj && typeof obj === "object") {
    const result: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(obj)) {
      if (
        (key === "richText" || key === "introContent") &&
        value &&
        typeof value === "object" &&
        "root" in (value as Record<string, unknown>)
      ) {
        result[key] = lexicalToHTML(value as Record<string, unknown>)
      } else if (
        value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        "url" in (value as Record<string, unknown>) &&
        "filename" in (value as Record<string, unknown>)
      ) {
        const media = value as Record<string, unknown>
        const mediaUrl = media.url as string | undefined
        result[key] = {
          url:
            mediaUrl?.startsWith("/api/media/file/")
              ? `/cms${mediaUrl}`
              : (mediaUrl ?? null),
          alt: media.alt ?? null,
          width: media.width ?? null,
          height: media.height ?? null,
        }
      } else if (typeof value === "object" && value !== null) {
        result[key] = convertRichTextFields(value as Record<string, unknown>, baseUrl)
      } else {
        result[key] = value
      }
    }
    return result
  }

  return obj
}

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
    logo: doc.logo
      ? ({
          id: (doc.logo as Record<string, unknown>).id as number,
          url: (doc.logo as Record<string, unknown>).url as string,
          alt: (doc.logo as Record<string, unknown>).alt as string | null,
          filename: (doc.logo as Record<string, unknown>).filename as string,
          mimeType: (doc.logo as Record<string, unknown>).mimeType as string,
          width: (doc.logo as Record<string, unknown>).width as number,
          height: (doc.logo as Record<string, unknown>).height as number,
        } as CMSMedia)
      : null,
  }

  return c.json(header)
})

cmsRoutes.get("/pages/:slug", async (c) => {
  const slug = c.req.param("slug")
  const cmsUrl = env(c, "CMS_URL")
  const tenantId = env(c, "CMS_TENANT_ID")

  if (!cmsUrl) {
    return c.json({ error: "CMS_URL not configured" }, 500)
  }
  if (!tenantId) {
    return c.json({ error: "CMS_TENANT_ID not configured" }, 500)
  }

  const url = `${cmsUrl}/api/pages?depth=2&where[slug][equals]=${encodeURIComponent(slug)}&where[tenant][equals]=${encodeURIComponent(tenantId)}`

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

  const converted = convertRichTextFields(doc, cmsUrl)
  return c.json(converted)
})

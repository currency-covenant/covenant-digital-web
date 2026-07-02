import { Hono } from "hono"

function env(c: { env?: Record<string, unknown> }, key: string): string | undefined {
  return (c.env?.[key] as string | undefined) || process.env[key]
}

type RenderEnv = {
  Bindings: {
    CMS_URL: string
    CMS_TENANT_ID: string
  }
}

export const renderRoutes = new Hono<RenderEnv>()

renderRoutes.get("/:tenant/*", async (c) => {
  const tenant = c.req.param("tenant")
  const slug = c.req.param("slug") || ""
  const cmsUrl = env(c, "CMS_URL")

  if (!cmsUrl) {
    return c.json({ error: "CMS_URL not configured" }, 500)
  }

  const slugPath = slug ? `/${slug}` : ""

  const url = `${cmsUrl}/render/${tenant}${slugPath}`

  let res: Response
  try {
    res = await fetch(url, {
      headers: { "Content-Type": "text/html" },
    })
  } catch {
    return c.json({ error: "CMS unreachable" }, 502)
  }

  if (!res.ok) {
    if (res.status === 404) {
      return c.json({ error: "Page not found" }, 404)
    }
    return c.json({ error: "CMS fetch failed" }, res.status as any)
  }

  const html = await res.text()

  return c.html(html, 200, {
    "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
  })
})

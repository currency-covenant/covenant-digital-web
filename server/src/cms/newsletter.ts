import { Hono } from "hono"
import { Resend } from "resend"

function env(c: { env?: Record<string, unknown> }, key: string): string | undefined {
  return (c.env?.[key] as string | undefined) || process.env[key]
}

type NewsletterEnv = {
  Bindings: {
    RESEND_API_KEY: string
    RESEND_NEWSLETTER_AUDIENCE_ID: string
  }
}

export const newsletterRoutes = new Hono<NewsletterEnv>()

newsletterRoutes.post("/subscribe", async (c) => {
  const apiKey = env(c, "RESEND_API_KEY")
  const audienceId = env(c, "RESEND_NEWSLETTER_AUDIENCE_ID")

  if (!apiKey) {
    return c.json({ error: "RESEND_API_KEY not configured" }, 500)
  }
  if (!audienceId) {
    return c.json({ error: "RESEND_NEWSLETTER_AUDIENCE_ID not configured" }, 500)
  }

  let body: { email?: string }
  try {
    body = await c.req.json()
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400)
  }

  const email = body.email?.trim()
  if (!email) {
    return c.json({ error: "Email is required" }, 400)
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return c.json({ error: "Invalid email address" }, 400)
  }

  const resend = new Resend(apiKey)

  try {
    const result = await resend.contacts.create({
      email,
      audienceId,
      unsubscribed: false,
    })

    if (result.error) {
      return c.json({ error: result.error.message }, 500)
    }

    return c.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to subscribe"
    return c.json({ error: message }, 500)
  }
})

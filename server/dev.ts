import { readFileSync } from "fs"
import { resolve } from "path"

const envPath = resolve(import.meta.dir, ".dev.vars")
try {
  const content = readFileSync(envPath, "utf-8")
  for (const line of content.split("\n")) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const eqIndex = trimmed.indexOf("=")
    if (eqIndex === -1) continue
    const key = trimmed.slice(0, eqIndex).trim()
    let value = trimmed.slice(eqIndex + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!process.env[key]) {
      process.env[key] = value
    }
  }
} catch {
}

const { default: app } = await import("./src/index.ts")
const port = Number(process.env.PORT) || 8787

Bun.serve({
  fetch: app.fetch,
  port,
})

console.log(`Hono server running on http://localhost:${port}`)

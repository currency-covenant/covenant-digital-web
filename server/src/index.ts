import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { cmsRoutes } from "./cms"
import { renderRoutes } from "./render"

const app = new Hono()

app.use(logger())
app.use(
  "/*",
  cors({
    origin: (origin) => {
      if (
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:")
      ) {
        return origin
      }
      if (
        origin === "https://covenantdigital.tech" ||
        origin === "https://www.covenantdigital.tech"
      ) {
        return origin
      }
      if (origin.endsWith(".pages.dev")) {
        return origin
      }
      return null
    },
    allowMethods: ["GET", "POST", "OPTIONS"],
  }),
)

app.route("/cms", cmsRoutes)
app.route("/rsc", renderRoutes)

app.get("/", (c) => {
  return c.text("Covenant Digital API — OK")
})

export default app
export type AppType = typeof app

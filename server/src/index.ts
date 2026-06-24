import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { cmsRoutes } from "./cms"

const app = new Hono()

app.use(logger())
app.use(
  "/*",
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      ...(process.env.CLIENT_URL ? [process.env.CLIENT_URL] : []),
    ],
    allowMethods: ["GET", "POST", "OPTIONS"],
  }),
)

app.route("/cms", cmsRoutes)

app.get("/", (c) => {
  return c.text("Covenant Digital API — OK")
})

export default app
export type AppType = typeof app

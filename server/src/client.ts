import { hc } from "hono/client"
import type { AppType } from "./index"

export const client = hc<AppType>(process.env.VITE_SERVER_URL || "http://localhost:8787")

export type { AppType }

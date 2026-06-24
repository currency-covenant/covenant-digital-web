import { useQuery } from "@tanstack/react-query"
import type { CMSHeader } from "shared"

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8787"

export function useHeader() {
  return useQuery<CMSHeader | null>({
    queryKey: ["header"],
    queryFn: async () => {
      const res = await fetch(`${SERVER_URL}/cms/header`)
      if (!res.ok) {
        throw new Error("Failed to fetch header")
      }
      return res.json()
    },
    staleTime: 1000 * 60 * 5,
  })
}

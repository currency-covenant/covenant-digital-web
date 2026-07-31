import { useQuery } from "@tanstack/react-query"
import type { CMSFooter } from "shared"

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8787"

export function useFooter() {
  return useQuery<CMSFooter | null>({
    queryKey: ["footer"],
    queryFn: async () => {
      const res = await fetch(`${SERVER_URL}/cms/footer`)
      if (!res.ok) {
        throw new Error("Failed to fetch footer")
      }
      return res.json()
    },
    staleTime: 1000 * 60 * 5,
  })
}

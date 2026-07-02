import { useQuery } from "@tanstack/react-query"
import type { CMSPage } from "shared"

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8787"

export function useCMSPage(slug: string) {
  return useQuery<CMSPage | null>({
    queryKey: ["cms", "pages", slug],
    queryFn: async () => {
      const res = await fetch(
        `${SERVER_URL}/cms/pages/${encodeURIComponent(slug)}`,
      )
      if (!res.ok) {
        throw new Error("Failed to fetch CMS page")
      }
      return res.json() as Promise<CMSPage | null>
    },
    staleTime: 1000 * 60 * 5,
  })
}

export interface CMSLink {
  type?: "reference" | "custom" | null
  newTab?: boolean | null
  url?: string | null
  label: string
}

export interface CMSNavLink {
  link: CMSLink
  id?: string | null
  children?: CMSNavLink[] | null
}

export interface CMSMedia {
  id: number
  url: string
  alt?: string | null
  filename?: string
  mimeType?: string
  width?: number
  height?: number
}

export interface CMSHeader {
  id: number
  title: string
  navLinks?: CMSNavLink[] | null
  logo?: CMSMedia | null
}

export interface CMSLink {
  type?: "reference" | "custom" | null
  newTab?: boolean | null
  url?: string | null
  label: string
  appearance?: "default" | "outline" | null
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

/* ── Block Types ── */

export interface CMSCTALink {
  link: CMSLink
  id?: string | null
}

export interface CMSContentColumn {
  size: "oneThird" | "half" | "twoThirds" | "full"
  richText: string
  enableLink?: boolean
  link?: CMSLink | null
}

export interface CMSContentBlock {
  blockType: "content"
  columns: CMSContentColumn[]
}

export interface CMSCTABlock {
  blockType: "cta"
  richText: string
  links?: CMSCTALink[] | null
  backgroundImage?: CMSMedia | null
}

export interface CMSMediaBlock {
  blockType: "mediaBlock"
  media: CMSMedia
}

export interface CMSProfileBlock {
  blockType: "profile"
  name: string
  words: { word: string; id?: string | null }[]
  description?: string | null
  profileImage?: CMSMedia | null
}

export interface CMSProductGridItem {
  id?: string | null
  name: string
  description: string
  projectLink?: string | null
  beta?: boolean | null
  iconImage?: CMSMedia | null
}

export interface CMSProductGridBlock {
  blockType: "productGrid"
  items: CMSProductGridItem[]
}

export interface CMSWorkGridItem {
  id?: string | null
  name: string
  description: string
  projectLink?: string | null
  repoLink?: string | null
  directory?: boolean | null
  beta?: boolean | null
  iconImage?: CMSMedia | null
  images?: { image: CMSMedia; id?: string | null }[] | null
}

export interface CMSWorkGridBlock {
  blockType: "workGrid"
  items: CMSWorkGridItem[]
}

export interface CMSArchiveBlock {
  blockType: "archive"
  introContent?: string | null
  populateBy?: "collection" | "selection" | null
  relationTo?: "posts" | null
  categories?: unknown[] | null
  limit?: number | null
  selectedDocs?: unknown[] | null
}

export interface CMSFormBlock {
  blockType: "formBlock"
  form: unknown
  enableIntro?: boolean | null
  introContent?: string | null
}

export type CMSBlock =
  | CMSContentBlock
  | CMSCTABlock
  | CMSMediaBlock
  | CMSProfileBlock
  | CMSProductGridBlock
  | CMSWorkGridBlock
  | CMSArchiveBlock
  | CMSFormBlock

/* ── Hero ── */

export interface CMSHero {
  type: "none" | "highImpact" | "mediumImpact" | "lowImpact"
  richText?: string | null
  links?: CMSCTALink[] | null
  media?: CMSMedia | null
}

/* ── SEO Meta ── */

export interface CMSMeta {
  title?: string | null
  description?: string | null
  image?: string | null
}

/* ── Page ── */

export interface CMSPage {
  id: number
  title: string
  slug?: string | null
  hero?: CMSHero | null
  layout?: CMSBlock[] | null
  meta?: CMSMeta | null
  publishedAt?: string | null
  updatedAt: string
  createdAt: string
}

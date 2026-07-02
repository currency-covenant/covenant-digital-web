interface LexicalNode {
  type: string
  children?: LexicalNode[]
  text?: string
  format?: number
  tag?: string
  listType?: string
  url?: string
  [key: string]: unknown
}

const BOLD = 1
const ITALIC = 2
const UNDERLINE = 4
const STRIKETHROUGH = 8
const CODE = 16

function serializeText(node: LexicalNode): string {
  let text = node.text ?? ""
  const format = node.format ?? 0

  if (format & CODE) text = `<code>${text}</code>`
  if (format & BOLD) text = `<strong>${text}</strong>`
  if (format & ITALIC) text = `<em>${text}</em>`
  if (format & UNDERLINE) text = `<u>${text}</u>`
  if (format & STRIKETHROUGH) text = `<s>${text}</s>`

  return text
}

function serializeNode(node: LexicalNode): string {
  switch (node.type) {
    case "root":
    case "paragraph":
      return `<p>${serializeChildren(node)}</p>`

    case "heading":
      return `<${node.tag}>${serializeChildren(node)}</${node.tag}>`

    case "text":
      return serializeText(node)

    case "link":
      return `<a href="${escapeHtml(node.url ?? "")}">${serializeChildren(node)}</a>`

    case "list": {
      const tag = node.listType === "number" ? "ol" : "ul"
      return `<${tag}>${serializeChildren(node)}</${tag}>`
    }

    case "listitem":
      return `<li>${serializeChildren(node)}</li>`

    case "quote":
      return `<blockquote>${serializeChildren(node)}</blockquote>`

    case "code":
      return `<pre><code>${serializeChildren(node)}</code></pre>`

    case "horizontalrule":
      return "<hr>"

    case "linebreak":
      return "<br>"

    default:
      return serializeChildren(node)
  }
}

function serializeChildren(node: LexicalNode): string {
  if (!node.children) return ""
  return node.children.map(serializeNode).join("")
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

export function lexicalToHTML(lexicalJson: Record<string, unknown> | null | undefined): string {
  if (!lexicalJson?.root) return ""
  return serializeChildren(lexicalJson.root as LexicalNode)
}

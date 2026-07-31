import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useFooter } from "@/hooks/server/cms/GET/useFooter"
import type {
  CMSFooterColumn,
  CMSFooterLink,
  CMSFooterSocialLink,
} from "shared"
import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6"

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8787"

const socialIcons: Record<CMSFooterSocialLink["platform"], React.ComponentType<{ className?: string }>> = {
  twitter: FaXTwitter,
  facebook: FaFacebook,
  instagram: FaInstagram,
  linkedin: FaLinkedin,
  youtube: FaYoutube,
  github: FaGithub,
}

function isExternal(url: string): boolean {
  return url.startsWith("http")
}

function isHashLink(url: string): boolean {
  return url.startsWith("#")
}

function FooterLinkAnchor({
  link,
  className,
}: {
  link: CMSFooterLink["link"]
  className?: string
}) {
  const { label, url, newTab } = link
  if (!url) return <span className={className}>{label}</span>

  if (isHashLink(url)) {
    return (
      <a href={url} className={className}>
        {label}
      </a>
    )
  }

  if (isExternal(url)) {
    return (
      <a
        href={url}
        target={newTab ? "_blank" : undefined}
        rel={newTab ? "noopener noreferrer" : undefined}
        className={className}
      >
        {label}
      </a>
    )
  }

  return (
    <Link
      to={url}
      target={newTab ? "_blank" : undefined}
      className={className}
    >
      {label}
    </Link>
  )
}

function FooterColumn({ column }: { column: CMSFooterColumn }) {
  const links = column.links ?? []
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-foreground">
        {column.title}
      </h3>
      <ul className="flex flex-col gap-2">
        {links.map((item, i) => (
          <li key={item.id ?? i}>
            <FooterLinkAnchor
              link={item.link}
              className="text-sm text-foreground transition-colors hover:text-foreground/80"
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

function NewsletterForm({
  heading,
  placeholder,
  buttonLabel,
}: {
  heading: string
  placeholder: string
  buttonLabel: string
}) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setMessage("")

    try {
      const res = await fetch(`${SERVER_URL}/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (!res.ok) {
        setStatus("error")
        setMessage(data.error || "Failed to subscribe")
        return
      }

      setStatus("success")
      setMessage("Thanks for subscribing!")
      setEmail("")
    } catch {
      setStatus("error")
      setMessage("Failed to subscribe")
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-foreground">{heading}</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            required
            className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-foreground/70 focus:border-ring focus:ring-1 focus:ring-ring"
          />
          <Button
            type="submit"
            disabled={status === "loading"}
            variant="default"
            size="sm"
          >
            {status === "loading" ? "Subscribing..." : buttonLabel}
          </Button>
        </div>
          {message && (
          <p
            className={`text-sm ${
              status === "error" ? "text-destructive" : "text-foreground"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  )
}

export function Footer() {
  const { data: footer, isLoading, isError } = useFooter()

  if (isLoading) {
    return (
      <div className="mx-auto max-w-screen-2xl border-t border-border bg-background px-8 py-12">
        <footer className="w-full">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4 flex flex-col gap-6">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-16 w-full" />
              <div className="flex gap-4">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-5 w-5" />
              </div>
            </div>
            <div className="lg:col-span-5 grid gap-8 sm:grid-cols-2">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
            <div className="lg:col-span-3">
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
          <div className="mt-12 flex flex-col justify-between gap-4 border-t border-border pt-8 md:flex-row">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </footer>
      </div>
    )
  }

  if (isError || !footer || footer.columns.length === 0) {
    return null
  }

  return (
    <div className="flex justify-around max-w-full border-t border-border bg-background px-8 py-12">
      <footer className="max-w-screen-2xl w-full">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Left: logo + description + social icons */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {footer.logo?.url && (
              <Link to="/">
                <img
                  src={footer.logo.url}
                  alt={footer.logo.alt ?? "Logo"}
                  className="h-14 w-auto object-contain"
                />
              </Link>
            )}
            {footer.description && (
              <p className="text-sm text-foreground leading-relaxed">
                {footer.description}
              </p>
            )}
            {footer.socialLinks && footer.socialLinks.length > 0 && (
              <div className="flex items-center gap-4">
                {footer.socialLinks.map((item, i) => {
                  const Icon = socialIcons[item.platform]
                  return (
                    <a
                      key={item.id ?? i}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground transition-colors hover:text-foreground/80"
                      aria-label={item.platform}
                    >
                      <Icon className="size-5" />
                    </a>
                  )
                })}
              </div>
            )}
          </div>

          {/* Middle: link columns */}
          <div className="lg:col-span-5 grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            {footer.columns.map((column, i) => (
              <FooterColumn key={column.id ?? i} column={column} />
            ))}
          </div>

          {/* Right: newsletter */}
          <div className="lg:col-span-3">
            <NewsletterForm
              heading={footer.newsletterHeading ?? "Stay up to date"}
              placeholder={footer.newsletterPlaceholder ?? "Enter your email"}
              buttonLabel={footer.newsletterButtonLabel ?? "Subscribe"}
            />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-foreground">
            {footer.copyrightText ?? ""}
          </p>
          {footer.legalLinks && footer.legalLinks.length > 0 && (
            <div className="flex flex-wrap gap-6">
              {footer.legalLinks.map((item, i) => (
                <FooterLinkAnchor
                  key={item.id ?? i}
                  link={item.link}
                  className="text-sm text-foreground transition-colors hover:text-foreground/80"
                />
              ))}
            </div>
          )}
        </div>
      </footer>
    </div>
  )
}

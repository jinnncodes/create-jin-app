import { useEffect } from 'react'

export type SeoRobots = 'index,follow' | 'noindex,nofollow' | 'noindex,follow'

export type SeoConfig = {
  title: string
  description: string
  path?: string
  canonicalUrl?: string
  imageUrl?: string
  type?: 'website' | 'article'
  robots?: SeoRobots
  twitterCard?: 'summary' | 'summary_large_image'
}

const DEFAULT_APP_NAME = 'Jin Starter App'

export function getAppName(): string {
  return import.meta.env.VITE_APP_NAME || DEFAULT_APP_NAME
}

export function getAppOrigin(): string {
  const configured = import.meta.env.VITE_APP_URL
  if (configured) {
    return configured.replace(/\/$/, '')
  }
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return ''
}

export function isPrivatePath(pathname: string): boolean {
  const privatePrefixes = ['/dashboard', '/settings', '/login']
  if (pathname === '/') {
    return true
  }
  return privatePrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
}

export function buildCanonicalUrl(path = '/'): string {
  const origin = getAppOrigin()
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${origin}${normalized}`
}

function upsertMeta(selector: string, attributes: Record<string, string>) {
  if (typeof document === 'undefined') {
    return
  }

  let element = document.head.querySelector(selector) as HTMLMetaElement | null
  if (!element) {
    element = document.createElement('meta')
    document.head.appendChild(element)
  }

  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value)
  }
}

function upsertLink(rel: string, href: string) {
  if (typeof document === 'undefined') {
    return
  }

  let element = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null
  if (!element) {
    element = document.createElement('link')
    element.rel = rel
    document.head.appendChild(element)
  }
  element.href = href
}

export function applySeo(config: SeoConfig) {
  const appName = getAppName()
  const title = config.title.includes(appName) ? config.title : `${config.title} | ${appName}`
  const description = config.description
  const canonical = config.canonicalUrl ?? buildCanonicalUrl(config.path ?? '/')
  const robots = config.robots ?? 'index,follow'
  const imageUrl = config.imageUrl
  const type = config.type ?? 'website'
  const twitterCard = config.twitterCard ?? (imageUrl ? 'summary_large_image' : 'summary')

  document.title = title

  upsertMeta('meta[name="description"]', { name: 'description', content: description })
  upsertMeta('meta[name="robots"]', { name: 'robots', content: robots })
  upsertLink('canonical', canonical)

  upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title })
  upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description })
  upsertMeta('meta[property="og:type"]', { property: 'og:type', content: type })
  upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical })
  upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: appName })

  if (imageUrl) {
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: imageUrl })
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: imageUrl })
  }

  upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: twitterCard })
  upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title })
  upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description })
}

export function privatePageSeo(title: string, path: string): SeoConfig {
  return {
    title,
    description: 'Private application page.',
    path,
    robots: 'noindex,nofollow',
  }
}

export function publicPageSeo(config: Omit<SeoConfig, 'robots'>): SeoConfig {
  return {
    ...config,
    robots: 'index,follow',
  }
}

export function Seo({
  title,
  description,
  path,
  canonicalUrl,
  imageUrl,
  type,
  robots,
  twitterCard,
}: SeoConfig) {
  useEffect(() => {
    applySeo({ title, description, path, canonicalUrl, imageUrl, type, robots, twitterCard })
  }, [title, description, path, canonicalUrl, imageUrl, type, robots, twitterCard])

  return null
}

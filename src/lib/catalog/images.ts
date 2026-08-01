// Public CDN URL for a catalog image with Supabase image transforms
// (AVIF/WebP negotiated by the CDN, resized server-side → small thumbnails).
// Deterministic URL — built directly so it works in server components too.
// Catalog images live in a PUBLIC bucket; Rx photos never do.
const BUCKET = 'catalog'

export function productImageUrl(
  storageKey: string,
  opts: { width: number; quality?: number } = { width: 400 },
): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = storageKey.replace(/^\/+/, '')
  const q = new URLSearchParams({
    width: String(opts.width),
    quality: String(opts.quality ?? 70),
    resize: 'contain',
  })
  return `${base}/storage/v1/render/image/public/${BUCKET}/${encodeURI(key)}?${q}`
}

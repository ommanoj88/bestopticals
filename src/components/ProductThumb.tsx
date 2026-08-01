import type { ProductImage } from '@/lib/catalog/types'
import { productImageUrl } from '@/lib/catalog/images'

// Thumbnail. When an image exists it blur-ups from its LQIP (the "focus" thesis,
// doing double duty as the real loading state). No image yet → a quiet sheen
// placeholder with the frame name, never a broken box.
// ponytail: plain <img> — Supabase already does the CDN resize; server-safe.
export function ProductThumb({
  images,
  name,
  width = 400,
}: {
  images: ProductImage[]
  name: string
  width?: number
}) {
  const hero = images.find((i) => i.is_hero) ?? images[0]

  if (!hero) {
    return (
      <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-gradient-to-br from-raised to-void">
        <div className="pointer-events-none absolute inset-0 opacity-20 aurora-fill" aria-hidden />
        <svg viewBox="0 0 120 46" className="relative w-24 text-chalk/30" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden>
          <rect x="4" y="8" width="46" height="32" rx="10" />
          <rect x="70" y="8" width="46" height="32" rx="10" />
          <path d="M50 20 h20" />
        </svg>
        <span className="absolute bottom-3 text-center text-xs font-medium text-mist">{name}</span>
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={productImageUrl(hero.storage_key, { width })}
      alt={name}
      width={width}
      height={Math.round((width * 3) / 4)}
      loading="lazy"
      decoding="async"
      className="aspect-[4/3] w-full bg-raised object-cover"
      style={hero.lqip ? { backgroundImage: `url(${hero.lqip})`, backgroundSize: 'cover' } : undefined}
    />
  )
}

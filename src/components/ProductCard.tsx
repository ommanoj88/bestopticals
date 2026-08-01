'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { Product, ProductImage } from '@/lib/catalog/types'
import { ProductThumb } from './ProductThumb'
import { rupees } from '@/lib/money'

// Premium product card — the retail signals that make a shop feel "ahead":
// discount % badge, wishlist heart, colour dot, rating, hover lift + shadow,
// and a "+ lens from ₹300" cue that hints the lens configurator.
export function ProductCard({ product, images }: { product: Product; images: ProductImage[] }) {
  const [wished, setWished] = useState(false)
  const off =
    product.mrp_inr && product.mrp_inr > product.price_inr
      ? Math.round((1 - product.price_inr / product.mrp_inr) * 100)
      : 0

  return (
    <Link
      href={`/shop/${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl glass transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
    >
      {/* image + overlays */}
      <div className="relative">
        <ProductThumb images={images} name={product.name} width={480} />

        {off > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-void/70 px-2.5 py-1 text-xs font-bold text-teal backdrop-blur">
            {off}% OFF
          </span>
        )}

        <button
          type="button"
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wished}
          onClick={(e) => {
            e.preventDefault()
            setWished((w) => !w)
          }}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-void/50 text-lg backdrop-blur transition-transform hover:scale-110"
        >
          <span className={wished ? 'text-amber' : 'text-mist'}>{wished ? '♥' : '♡'}</span>
        </button>
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="font-display text-lg leading-tight text-chalk">{product.name}</p>

        <p className="flex items-center gap-2 text-sm capitalize text-mist">
          {product.color && (
            <span
              className="inline-block h-3 w-3 rounded-full ring-1 ring-white/20"
              style={{ background: swatch(product.color) }}
              aria-hidden
            />
          )}
          {[product.frame_shape, product.material].filter(Boolean).join(' · ')}
        </p>

        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-chalk">{rupees(product.price_inr)}</span>
              {product.mrp_inr && product.mrp_inr > product.price_inr && (
                <span className="text-xs text-faint line-through">{rupees(product.mrp_inr)}</span>
              )}
            </div>
            <span className="text-xs text-faint">+ lens from {rupees(300)}</span>
          </div>
          <span className="rounded-full glass px-3 py-1.5 text-xs font-semibold text-chalk transition-colors group-hover:bg-white/10">
            View
          </span>
        </div>
      </div>
    </Link>
  )
}

// map a colour name to a display swatch
function swatch(name: string): string {
  const m: Record<string, string> = {
    black: '#222', gold: '#c9a24b', tortoise: '#7a4d2b', red: '#d4443e',
    silver: '#c4ccd2', blue: '#3a5bd0', brown: '#6b4429', clear: '#cfe0e6', grey: '#8892a4',
  }
  return m[name.toLowerCase()] ?? '#8ea3b0'
}

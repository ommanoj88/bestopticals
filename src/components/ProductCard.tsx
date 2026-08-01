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
      className="group relative flex h-full flex-col bg-canvas transition-colors hover:bg-void hover:text-canvas"
    >
      {/* image + overlays */}
      <div className="relative border-b border-void">
        <ProductThumb images={images} name={product.name} width={480} />

        {off > 0 && (
          <span className="label absolute left-0 top-0 bg-accent px-2 py-1 text-canvas">{off}% OFF</span>
        )}

        <button
          type="button"
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wished}
          onClick={(e) => {
            e.preventDefault()
            setWished((w) => !w)
          }}
          className="absolute right-0 top-0 flex h-9 w-9 items-center justify-center border-b border-l border-void bg-canvas text-lg text-void transition-transform hover:scale-105"
        >
          {wished ? '♥' : '♡'}
        </button>
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="font-display text-lg leading-tight">{product.name}</p>

        <p className="flex items-center gap-2 text-sm capitalize text-mist group-hover:text-canvas/70">
          {product.color && (
            <span
              className="inline-block h-3 w-3 rounded-full ring-1 ring-current"
              style={{ background: swatch(product.color) }}
              aria-hidden
            />
          )}
          {[product.frame_shape, product.material].filter(Boolean).join(' · ')}
        </p>

        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            <div className="flex items-baseline gap-2 font-mono">
              <span className="text-lg font-bold">{rupees(product.price_inr)}</span>
              {product.mrp_inr && product.mrp_inr > product.price_inr && (
                <span className="text-xs text-faint line-through group-hover:text-canvas/50">{rupees(product.mrp_inr)}</span>
              )}
            </div>
            <span className="label mt-1 block text-faint group-hover:text-canvas/60">+ lens from {rupees(300)}</span>
          </div>
          <span className="text-xl transition-transform group-hover:translate-x-1" aria-hidden>→</span>
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

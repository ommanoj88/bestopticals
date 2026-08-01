'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart'
import { useTranslations } from 'next-intl'

export function CartLink({ dark = false }: { dark?: boolean }) {
  const { count } = useCart()
  const t = useTranslations('shop')
  return (
    <Link
      href="/cart"
      className={`relative flex min-h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors ${
        dark ? 'text-chalk hover:bg-white/10' : 'text-ink hover:bg-paper-2'
      }`}
      aria-label={t('cart')}
    >
      {t('cart')}
      {count > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber px-1 text-xs font-bold text-night">
          {count}
        </span>
      )}
    </Link>
  )
}

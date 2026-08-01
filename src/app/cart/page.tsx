'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useCart } from '@/lib/cart'
import { rupees } from '@/lib/money'
import { SiteHeader } from '@/components/SiteHeader'

export default function CartPage() {
  const { lines, remove, totalInr } = useCart()
  const t = useTranslations('shop')

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 pb-12 pt-24">
        <Link href="/shop" className="inline-flex min-h-9 items-center text-sm text-ink-soft hover:text-ink">
          ← {t('back')}
        </Link>
        <h1 className="mt-3 font-display text-4xl text-ink">{t('cart')}</h1>

        {lines.length === 0 ? (
          <div className="mt-8 flex flex-col items-center gap-5 rounded-lens border border-line bg-card py-20">
            <p className="text-lg text-ink-soft">{t('cartEmpty')}</p>
            <Link
              href="/shop"
              className="min-h-11 rounded-full bg-ink px-6 py-2.5 text-base font-medium text-paper"
            >
              {t('title')}
            </Link>
          </div>
        ) : (
          <>
            <ul className="mt-6 flex flex-col gap-3">
              {lines.map((l, i) => (
                <li
                  key={i}
                  className="flex items-start justify-between gap-4 rounded-2xl border border-line bg-card p-4"
                >
                  <div>
                    <p className="font-display text-lg text-ink">{l.name}</p>
                    <p className="mt-0.5 text-sm text-ink-soft">
                      {l.visionTypeName ? l.visionTypeName : t('frameOnly')}
                      {l.coatingNames && l.coatingNames.length > 0 && ` · ${l.coatingNames.join(', ')}`}
                      {typeof l.lensPriceInr === 'number' && (
                        <span className="font-mono"> · {t('lens')} {rupees(l.lensPriceInr)}</span>
                      )}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="font-mono text-lg text-ink">
                      {rupees((l.framePriceInr + (l.lensPriceInr ?? 0)) * l.qty)}
                    </span>
                    <button
                      onClick={() => remove(i)}
                      className="text-sm text-ink-soft underline-offset-2 hover:text-ink hover:underline"
                    >
                      {t('remove')}
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-baseline justify-between border-t border-line pt-5">
              <span className="font-display text-xl text-ink">{t('total')}</span>
              <span className="font-mono text-2xl font-bold text-ink">{rupees(totalInr)}</span>
            </div>

            {/* Login is required only here at buy — implemented in W2/W3. */}
            <button
              disabled
              className="mt-5 min-h-14 w-full cursor-not-allowed rounded-2xl bg-ink text-lg font-semibold text-paper opacity-50"
            >
              {t('signInToBuy')}
            </button>
            <p className="mt-2 text-center text-sm text-ink-soft">{t('checkoutSoon')}</p>
          </>
        )}
      </main>
    </>
  )
}

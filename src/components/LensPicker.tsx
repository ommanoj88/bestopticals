'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import type { Product } from '@/lib/catalog/types'
import { type VisionType, type Coating, quoteLens, type RxPowers } from '@/lib/lens'
import { rupees } from '@/lib/money'
import { useCart } from '@/lib/cart'

// Product-page lens configurator:
//   1. pick vision type (Single Vision / Bifocal / Progressive)
//   2. enter Rx — per-eye SPH/CYL, plus ADD (bifocal/progressive) and PD (progressive)
//   3. optional coatings
// Price = vision base (by power band) + coatings. No login here (only at checkout).
export function LensPicker({
  product,
  visionTypes,
  coatings,
}: {
  product: Product
  visionTypes: VisionType[]
  coatings: Coating[]
}) {
  const t = useTranslations('shop')
  const { add } = useCart()
  const [visionId, setVisionId] = useState('')
  const [coatIds, setCoatIds] = useState<string[]>([])
  const [rx, setRx] = useState<Record<string, string>>({})
  const [added, setAdded] = useState(false)

  const vision = visionTypes.find((v) => v.id === visionId)
  const chosenCoatings = coatings.filter((c) => coatIds.includes(c.id))

  const num = (k: string) => (rx[k] === '' || rx[k] == null ? null : parseFloat(rx[k]))
  const rxPowers: RxPowers = {
    od_sph: num('od_sph'), od_cyl: num('od_cyl'),
    os_sph: num('os_sph'), os_cyl: num('os_cyl'),
    od_add: num('od_add'), os_add: num('os_add'),
    distance_pd: num('pd'),
  }

  const quote = vision ? quoteLens(vision, chosenCoatings, rxPowers) : null
  const anyRx = ['od_sph', 'od_cyl', 'os_sph', 'os_cyl'].some((k) => num(k) != null)
  const ready = !!(vision && quote && quote.totalInr !== null && quote.missing.length === 0 && anyRx)
  const total = product.price_inr + (quote?.totalInr ?? 0)

  function bandRange(v: VisionType) {
    if (!v.bands.length) return null
    const prices = v.bands.map((b) => b.price_inr)
    const lo = Math.min(...prices), hi = Math.max(...prices)
    return lo === hi ? rupees(lo) : `${rupees(lo)}–${rupees(hi)}`
  }

  function addToCart() {
    if (!ready || !vision || !quote) return
    add({
      productId: product.id,
      name: product.name,
      framePriceInr: product.price_inr,
      visionTypeId: vision.id,
      visionTypeName: vision.name,
      coatingNames: chosenCoatings.map((c) => c.name),
      lensPriceInr: quote.totalInr ?? undefined,
      qty: 1,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const rxField = (k: string, label: string, step = '0.25') => (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-wide text-ink-soft">{label}</span>
      <input
        type="number" inputMode="decimal" step={step} placeholder="0.00"
        value={rx[k] ?? ''}
        onChange={(e) => setRx((r) => ({ ...r, [k]: e.target.value }))}
        className="min-h-11 w-full rounded-xl border border-line bg-paper px-3 font-mono text-base text-ink focus:border-teal focus:outline-none"
      />
    </label>
  )

  return (
    <div className="flex flex-col gap-6">
      {/* 1 · vision type */}
      <div className="flex flex-col gap-3">
        <label className="font-display text-xl text-ink">{t('chooseVision')}</label>
        <div className="flex flex-col gap-2.5">
          {visionTypes.map((v) => {
            const on = v.id === visionId
            return (
              <button
                key={v.id}
                onClick={() => setVisionId(on ? '' : v.id)}
                aria-pressed={on}
                className={`relative flex min-h-16 items-center justify-between gap-3 overflow-hidden rounded-2xl border px-4 text-left transition-all ${
                  on ? 'border-transparent bg-ink text-paper' : 'border-line bg-card text-ink hover:border-teal/40'
                }`}
              >
                {on && <span className="sheen absolute inset-y-0 left-0 w-1.5" aria-hidden />}
                <span>
                  <span className="text-lg font-medium">{v.name}</span>
                  {v.description && (
                    <span className={`block text-sm ${on ? 'text-paper/60' : 'text-ink-soft'}`}>{v.description}</span>
                  )}
                </span>
                {bandRange(v) && (
                  <span className={`shrink-0 font-mono text-sm ${on ? 'text-paper/80' : 'text-ink-soft'}`}>
                    {bandRange(v)}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* 2 · prescription */}
      {vision && (
        <div className="flex flex-col gap-3">
          <label className="font-display text-xl text-ink">{t('enterRx')}</label>
          <div className="grid grid-cols-[auto_1fr_1fr] items-end gap-3">
            <span className="pb-3 text-sm font-medium text-ink-soft">{t('rightEye')}</span>
            {rxField('od_sph', t('sph'))}
            {rxField('od_cyl', t('cyl'))}
            <span className="pb-3 text-sm font-medium text-ink-soft">{t('leftEye')}</span>
            {rxField('os_sph', t('sph'))}
            {rxField('os_cyl', t('cyl'))}
          </div>

          {/* ADD (bifocal + progressive) */}
          {vision.needs_add && (
            <div className="grid grid-cols-[auto_1fr_1fr] items-end gap-3">
              <span className="pb-3 text-sm font-medium text-ink-soft">{t('add')}</span>
              {rxField('od_add', `${t('rightEye')} ${t('add')}`)}
              {rxField('os_add', `${t('leftEye')} ${t('add')}`)}
            </div>
          )}

          {/* PD (progressive) */}
          {vision.needs_pd && (
            <div className="w-40">{rxField('pd', t('pd'), '0.5')}</div>
          )}

          {/* missing-field warnings */}
          {quote?.missing.map((m) => (
            <p key={m} className="text-sm text-amber-deep">⚠ {m}</p>
          ))}
          {anyRx && quote && quote.basePriceInr === null && (
            <p className="text-sm text-amber-deep">{t('powerNoBand')}</p>
          )}
          <p className="text-sm text-ink-soft">{t('rxHelp')}</p>
        </div>
      )}

      {/* 3 · coatings */}
      {vision && (
        <div className="flex flex-col gap-3">
          <label className="font-display text-xl text-ink">{t('chooseCoating')}</label>
          <div className="flex flex-wrap gap-2">
            {coatings.map((c) => {
              const on = coatIds.includes(c.id)
              return (
                <button
                  key={c.id}
                  onClick={() => setCoatIds((ids) => (on ? ids.filter((i) => i !== c.id) : [...ids, c.id]))}
                  aria-pressed={on}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition-colors ${
                    on ? 'border-teal bg-teal/10 text-teal-deep' : 'border-line bg-card text-ink hover:border-teal/40'
                  }`}
                >
                  <span className="font-medium">{c.name}</span>
                  <span className="font-mono text-xs text-ink-soft">+{rupees(c.price_inr)}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* price summary */}
      <div className="flex flex-col gap-1.5 border-t border-line pt-5">
        <div className="flex justify-between text-base text-ink-soft">
          <span>{t('frame')}</span>
          <span className="font-mono">{rupees(product.price_inr)}</span>
        </div>
        {vision && (
          <div className="flex justify-between text-base text-ink-soft">
            <span>{t('baseLens', { vision: vision.name })}</span>
            <span className="font-mono">{quote?.basePriceInr != null ? rupees(quote.basePriceInr) : '—'}</span>
          </div>
        )}
        {chosenCoatings.length > 0 && (
          <div className="flex justify-between text-base text-ink-soft">
            <span>{t('coatings')} ({chosenCoatings.length})</span>
            <span className="font-mono">+{rupees(quote?.coatingsPriceInr ?? 0)}</span>
          </div>
        )}
        <div className="mt-1 flex items-baseline justify-between">
          <span className="font-display text-xl text-ink">{t('total')}</span>
          <span className="font-mono text-2xl font-bold text-ink">{rupees(total)}</span>
        </div>
      </div>

      <button
        onClick={addToCart}
        disabled={!ready}
        className={`min-h-14 rounded-2xl text-lg font-semibold transition-colors ${
          added ? 'bg-teal text-white' : ready ? 'bg-ink text-white hover:bg-ink/90' : 'cursor-not-allowed bg-line text-ink-soft'
        }`}
      >
        {added ? t('addedToCart') : ready ? t('addToCart') : t('addToCartNeedsRx')}
      </button>
    </div>
  )
}

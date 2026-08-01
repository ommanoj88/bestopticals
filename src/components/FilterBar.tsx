'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'

type Facets = {
  shape: string[]
  material: string[]
  size: string[]
  color: string[]
  gender: string[]
}

// URL-driven filters: each select writes to the query string; the server
// re-renders the list. No client fetching, shareable links, back-button works.
export function FilterBar({ facets }: { facets: Facets }) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const t = useTranslations('shop')

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString())
    if (value) next.set(key, value)
    else next.delete(key)
    router.push(next.toString() ? `${pathname}?${next}` : pathname)
  }

  // price bands write BOTH min and max at once (value encoded "min-max")
  function setPrice(value: string) {
    const next = new URLSearchParams(params.toString())
    next.delete('min')
    next.delete('max')
    if (value) {
      const [min, max] = value.split('-')
      if (min && min !== '0') next.set('min', min)
      if (max && max !== '0') next.set('max', max)
    }
    router.push(next.toString() ? `${pathname}?${next}` : pathname)
  }
  const priceValue = `${params.get('min') ?? '0'}-${params.get('max') ?? '0'}`

  const selects: { key: string; label: string; opts: string[] }[] = [
    { key: 'shape', label: t('shape'), opts: facets.shape },
    { key: 'material', label: t('material'), opts: facets.material },
    { key: 'size', label: t('size'), opts: facets.size },
    { key: 'color', label: t('color'), opts: facets.color },
    { key: 'gender', label: t('gender'), opts: facets.gender },
  ]

  const priceBands = [
    { label: 'Under ₹1,000', v: '0-1000' },
    { label: '₹1,000 – ₹1,500', v: '1000-1500' },
    { label: '₹1,500 – ₹2,000', v: '1500-2000' },
    { label: '₹2,000 & above', v: '2000-0' },
  ]

  const hasAny = selects.some((s) => params.get(s.key)) || params.get('max') || params.get('min')

  const selectClass =
    'min-h-11 appearance-none rounded-full border border-line bg-card pl-4 pr-9 text-base text-ink transition-colors hover:border-teal/50 focus:border-teal focus:outline-none'
  // caret shown via background image so every select looks consistent
  const caret = {
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none' stroke='%234a5f6e' stroke-width='2'%3E%3Cpath d='M1 1l5 5 5-5'/%3E%3C/svg%3E\")",
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.85rem center',
  }

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {selects.map(
        (s) =>
          s.opts.length > 0 && (
            <select
              key={s.key}
              value={params.get(s.key) ?? ''}
              onChange={(e) => setParam(s.key, e.target.value)}
              aria-label={s.label}
              className={`${selectClass} capitalize ${params.get(s.key) ? 'border-teal bg-teal/5 font-medium' : ''}`}
              style={caret}
            >
              <option value="">{s.label}</option>
              {s.opts.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          ),
      )}
      <select
        value={priceValue === '0-0' ? '' : priceValue}
        onChange={(e) => setPrice(e.target.value)}
        aria-label={t('price')}
        className={`${selectClass} ${priceValue !== '0-0' ? 'border-teal bg-teal/5 font-medium' : ''}`}
        style={caret}
      >
        <option value="">{t('price')}</option>
        {priceBands.map((b) => (
          <option key={b.v} value={b.v}>
            {b.label}
          </option>
        ))}
      </select>
      {hasAny && (
        <button
          onClick={() => router.push(pathname)}
          className="min-h-11 rounded-full px-4 text-base text-teal-deep underline-offset-4 hover:underline"
        >
          {t('clear')}
        </button>
      )}
    </div>
  )
}

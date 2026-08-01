'use client'

import { useTransition } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { setLocale } from '@/i18n/actions'

// Two-language toggle (en / kn). Persists to cookie, then refreshes.
export function LangToggle({ dark = false }: { dark?: boolean }) {
  const locale = useLocale()
  const t = useTranslations('lang')
  const router = useRouter()
  const [pending, start] = useTransition()

  function choose(next: 'en' | 'kn') {
    if (next === locale) return
    start(async () => {
      await setLocale(next)
      router.refresh()
    })
  }

  return (
    <div
      className={`flex items-center rounded-full border p-0.5 text-sm transition-colors ${
        dark ? 'border-white/20 bg-white/10' : 'border-line bg-card'
      }`}
      aria-label={t('label')}
    >
      {(['en', 'kn'] as const).map((l) => {
        const active = l === locale
        return (
          <button
            key={l}
            onClick={() => choose(l)}
            disabled={pending}
            aria-pressed={active}
            className={`min-h-9 rounded-full px-3 transition-colors ${
              active
                ? dark
                  ? 'bg-chalk text-night'
                  : 'bg-ink text-paper'
                : dark
                  ? 'text-mist hover:text-chalk'
                  : 'text-ink-soft hover:text-ink'
            }`}
          >
            {t(l)}
          </button>
        )
      })}
    </div>
  )
}

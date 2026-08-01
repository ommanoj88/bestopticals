'use client'

import Link from 'next/link'
import { LangToggle } from './LangToggle'
import { CartLink } from './CartLink'

// Floating glass header, dark-first. `overHero` kept as an accepted prop so
// existing callers don't break; the bar looks the same everywhere now.
export function SiteHeader({ overHero: _overHero = false }: { overHero?: boolean }) {
  const nav = [
    { label: 'Eyeglasses', href: '/shop?category=frames' },
    { label: 'Readers', href: '/shop?category=readers' },
    { label: 'Contacts', href: '/shop?category=contacts' },
    { label: 'At Home', href: '/at-home' },
    { label: 'Book Test', href: '/book' },
  ]

  return (
    <header className="fixed inset-x-0 top-0 z-30">
      <div className="mx-auto mt-3 flex h-14 w-[calc(100%-1.5rem)] max-w-6xl items-center justify-between gap-6 rounded-full glass px-5">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="aurora-fill h-4 w-4 rounded-full ring-1 ring-white/30" aria-hidden />
          <span className="font-display text-lg leading-none text-chalk">The Best Opticals</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-sm font-medium text-mist transition-colors hover:text-chalk"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1">
          <LangToggle />
          <CartLink />
        </div>
      </div>
    </header>
  )
}

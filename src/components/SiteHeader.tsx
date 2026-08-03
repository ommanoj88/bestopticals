'use client'

import Link from 'next/link'
import { LangToggle } from './LangToggle'
import { CartLink } from './CartLink'

// Swiss/brutalist header: full-width, black bottom rule, mono nav, no rounding.
export function SiteHeader({ overHero: _overHero = false }: { overHero?: boolean }) {
  const nav = [
    { label: 'Eyeglasses', href: '/shop?category=frames' },
    { label: 'Readers', href: '/shop?category=readers' },
    { label: 'Contacts', href: '/shop?category=contacts' },
    { label: 'Book Test', href: '/book' },
  ]

  return (
    <header className="sticky top-0 z-30 border-b border-void bg-canvas">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-baseline gap-2">
          <span className="font-display text-lg font-semibold tracking-tight text-void">The Best Opticals</span>
          <span className="hidden text-accent sm:inline" aria-hidden>●</span>
        </Link>

        <nav className="hidden items-center lg:flex">
          {nav.map((n, i) => (
            <Link
              key={n.href}
              href={n.href}
              className={`label px-4 py-2 text-void transition-colors hover:text-accent ${i > 0 ? 'border-l border-void/15' : ''}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <LangToggle />
          <CartLink />
        </div>
      </div>
    </header>
  )
}

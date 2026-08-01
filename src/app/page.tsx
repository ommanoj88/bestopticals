import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { ProductRow } from '@/components/ProductRow'
import { FocusHeadline } from '@/components/FocusHeadline'
import { rupees } from '@/lib/money'

// Home — "Grid": Swiss/brutalist. Huge grotesque type, strict columns, black
// hairline rules, numbered sections, one hot accent (vermilion). English-only.
export default async function Home() {
  const marquee = [
    'OPTICIAN-VERIFIED LENSES', 'SAME-DAY FITTING', 'NO HIDDEN CHARGES',
    '27 YEARS OF FAMILY EYE CARE', 'AT-HOME EYE TESTS', 'HONEST PRICING',
  ]
  const shapes = [
    { label: 'Rectangle', q: 'rectangle', d: 'rect' as const },
    { label: 'Round', q: 'round', d: 'round' as const },
    { label: 'Square', q: 'square', d: 'square' as const },
    { label: 'Cat-eye', q: 'cat-eye', d: 'cat' as const },
  ]

  return (
    <>
      <SiteHeader />

      <main className="bg-canvas text-void">
        {/* ============ 00 · HERO ============ */}
        <section className="mx-auto max-w-[1400px] border-x border-void px-4 sm:px-6">
          <div className="flex items-center justify-between border-b border-void/15 py-3">
            <span className="label text-mist">00 — Since 1998 · Kolar &amp; KGF</span>
            <span className="label text-mist">Eyewear, in focus</span>
          </div>

          <div className="grid gap-6 py-10 lg:grid-cols-[1.5fr_1fr] lg:py-16">
            {/* headline block */}
            <div>
              <div className="rise d1">
                <FocusHeadline lines={['See it all,', 'perfectly clear.']} lensX={30} lensY={72} lensR={130} />
              </div>
            </div>

            {/* right rail: statement + CTAs */}
            <div className="flex flex-col justify-end gap-6 border-void/15 lg:border-l lg:pl-6">
              <p className="rise d2 text-lg leading-relaxed text-mist">
                Two family shops. Every frame fitted and checked by a real optician, lenses cut to your exact
                prescription, priced with nothing hidden. From {rupees(600)}.
              </p>
              <div className="rise d3 flex flex-col gap-3">
                <Link href="/shop" className="flex items-center justify-between bg-void px-6 py-4 text-canvas transition-colors hover:bg-accent">
                  <span className="font-display text-xl">Explore frames</span>
                  <span aria-hidden>→</span>
                </Link>
                <Link href="/book" className="flex items-center justify-between border border-void px-6 py-4 transition-colors hover:bg-void hover:text-canvas">
                  <span className="font-display text-xl">Book free eye test</span>
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ============ MARQUEE TICKER ============ */}
        <div className="overflow-hidden border-y border-void bg-void py-3 text-canvas">
          <div className="marquee flex w-max gap-6 whitespace-nowrap">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex gap-6" aria-hidden={dup === 1}>
                {marquee.map((m, i) => (
                  <span key={i} className="label flex items-center gap-6">
                    {m} <span className="text-accent">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ============ 01 · CATEGORIES (strict grid) ============ */}
        <section className="mx-auto max-w-[1400px] border-x border-void">
          <SectionHead n="01" title="Shop" note="Frames · Readers · Contacts" />
          <div className="grid grid-cols-1 md:grid-cols-3">
            <CatCell href="/shop?category=frames" label="Eyeglasses" from={600} big />
            <CatCell href="/shop?category=readers" label="Readers" from={600} />
            <CatCell href="/shop?category=contacts" label="Contacts" from={250} />
          </div>
        </section>

        {/* ============ 02 · AT-HOME (inverted band) ============ */}
        <section className="border-y border-void bg-void text-canvas">
          <div className="mx-auto grid max-w-[1400px] gap-6 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <span className="label text-accent">02 — At-home service</span>
              <h2 className="huge mt-4 text-5xl sm:text-7xl">Eye test &amp; frame trial, at your home.</h2>
              <p className="mt-5 max-w-xl text-lg text-canvas/70">
                Our optician comes to you with 150+ frames and a full 12-step checkup. ₹150 per person —
                fully refundable on any purchase.
              </p>
            </div>
            <Link href="/at-home" className="flex items-center justify-between gap-8 border border-canvas px-6 py-4 transition-colors hover:bg-canvas hover:text-void">
              <span className="font-display text-2xl">₹150 · Book a visit</span>
              <span aria-hidden>→</span>
            </Link>
          </div>
        </section>

        {/* ============ 03 · BESTSELLERS ============ */}
        <section className="mx-auto max-w-[1400px] border-x border-void">
          <SectionHead n="03" title="Bestsellers" note="Live from our shelves" href="/shop" cta="All frames" />
          <div className="border-t border-void">
            <ProductRow title="" href="/shop" bare />
          </div>
        </section>

        {/* ============ 04 · SHOP BY SHAPE ============ */}
        <section className="mx-auto max-w-[1400px] border-x border-b border-void">
          <SectionHead n="04" title="By shape" note="Find your fit" />
          <div className="grid grid-cols-2 md:grid-cols-4">
            {shapes.map((s, i) => (
              <Link
                key={s.q}
                href={`/shop?shape=${s.q}`}
                className={`group flex flex-col items-center gap-4 border-t border-void py-10 transition-colors hover:bg-void hover:text-canvas ${i > 0 ? 'border-l' : ''} ${i >= 2 ? '' : 'md:border-t-0'}`}
              >
                <ShapeIcon d={s.d} className="w-20" />
                <span className="label">{s.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ============ 05 · PLEDGE ============ */}
        <section className="mx-auto max-w-[1400px] border-x border-b border-void">
          <SectionHead n="05" title="Honest pricing" note="No games" />
          <div className="grid gap-px bg-void md:grid-cols-3">
            {[
              ['No subscriptions', 'Never a recurring charge you didn’t ask for.'],
              ['No “buy 1 get 1” gimmicks', 'Tricks that quietly pad the bill. Not here.'],
              ['No hidden charges', 'Every price — frame and lens — shown before you pay.'],
            ].map(([t, s]) => (
              <div key={t} className="bg-canvas p-8">
                <span className="text-accent" aria-hidden>✕</span>
                <h3 className="mt-4 font-display text-2xl">{t}</h3>
                <p className="mt-2 text-mist">{s}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ============ FOOTER ============ */}
        <footer className="mx-auto max-w-[1400px] border-x border-b border-void">
          <div className="grid gap-8 p-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="font-display text-xl font-semibold">The Best Opticals <span className="text-accent">●</span></div>
              <p className="mt-3 text-sm text-mist">Family eye care since 1998. KGF &amp; RL Jalappa Hospital, Kolar.</p>
            </div>
            <FooterCol title="Shop" links={[['Eyeglasses', '/shop?category=frames'], ['Readers', '/shop?category=readers'], ['Contacts', '/shop?category=contacts']]} />
            <FooterCol title="Services" links={[['Book an eye test', '/book'], ['At-home visit', '/at-home'], ['Virtual try-on', '/tryon']]} />
            <div>
              <div className="label text-void">Visit</div>
              <ul className="mt-3 flex flex-col gap-2 text-sm text-mist">
                <li>KGF — Robertsonpet</li>
                <li>RL Jalappa Hospital, Kolar</li>
                <li>Mon–Sat · 10am–8pm</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-void px-8 py-4">
            <span className="label text-mist">© 1998–2026 The Best Opticals · No hidden charges, ever.</span>
          </div>
        </footer>
      </main>
    </>
  )
}

function SectionHead({ n, title, note, href, cta }: { n: string; title: string; note: string; href?: string; cta?: string }) {
  return (
    <div className="flex items-end justify-between gap-4 px-4 pt-10 pb-5 sm:px-6">
      <div className="flex items-baseline gap-4">
        <span className="label text-accent">{n}</span>
        <h2 className="huge text-4xl sm:text-6xl">{title}</h2>
      </div>
      {href && cta ? (
        <Link href={href} className="label ul-sweep hidden text-void sm:inline">{cta} →</Link>
      ) : (
        <span className="label hidden text-mist sm:inline">{note}</span>
      )}
    </div>
  )
}

function CatCell({ href, label, from, big }: { href: string; label: string; from: number; big?: boolean }) {
  return (
    <Link
      href={href}
      className={`group relative flex flex-col justify-between border-t border-void p-8 transition-colors hover:bg-void hover:text-canvas md:border-t-0 md:[&:not(:first-child)]:border-l md:border-l-void ${big ? 'min-h-[22rem]' : 'min-h-[16rem]'}`}
    >
      <div className="flex items-start justify-between">
        <ShapeIcon d="rect" className="w-16 opacity-80" />
        <span className="label">from {rupees(from)}</span>
      </div>
      <div className="flex items-end justify-between">
        <h3 className="huge text-4xl sm:text-5xl">{label}</h3>
        <span className="text-2xl transition-transform group-hover:translate-x-1" aria-hidden>→</span>
      </div>
    </Link>
  )
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <div className="label text-void">{title}</div>
      <ul className="mt-3 flex flex-col gap-2 text-sm text-mist">
        {links.map(([l, h]) => (
          <li key={h}><Link href={h} className="ul-sweep hover:text-void">{l}</Link></li>
        ))}
      </ul>
    </div>
  )
}

function ShapeIcon({ d, className = '' }: { d: 'rect' | 'round' | 'square' | 'cat'; className?: string }) {
  const c = { fill: 'none', stroke: 'currentColor', strokeWidth: 4, strokeLinejoin: 'round' as const }
  return (
    <svg viewBox="0 0 160 70" className={className} aria-hidden>
      {d === 'round' ? (
        <><circle cx="42" cy="35" r="26" {...c} /><circle cx="118" cy="35" r="26" {...c} /></>
      ) : d === 'cat' ? (
        <><path d="M14 26 q4 24 34 24 q26 0 26-22 q-30 -8 -60 -2Z" {...c} /><path d="M146 26 q-4 24 -34 24 q-26 0 -26-22 q30 -8 60 -2Z" {...c} /></>
      ) : (
        <><rect x="14" y="16" width="56" height="40" rx={d === 'square' ? 6 : 14} {...c} /><rect x="90" y="16" width="56" height="40" rx={d === 'square' ? 6 : 14} {...c} /></>
      )}
      <path d="M70 34 h20" {...c} />
    </svg>
  )
}

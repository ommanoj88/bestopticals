import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { ProductRow } from '@/components/ProductRow'
import { FocusHeadline } from '@/components/FocusHeadline'
import { rupees } from '@/lib/money'

// Home — "Aperture": dark-first, immersive. Aurora hero → bento grid (mixing
// categories, the at-home flagship, and proof) → live product rail → pledge.
export default async function Home() {
  const benefits = ['Optician-verified', 'Same-day fitting', 'Free lens fitting', 'Honest pricing']
  const shapes = [
    { label: 'Rectangle', q: 'rectangle', d: 'rect' as const },
    { label: 'Round', q: 'round', d: 'round' as const },
    { label: 'Square', q: 'square', d: 'square' as const },
    { label: 'Cat-eye', q: 'cat-eye', d: 'cat' as const },
  ]

  return (
    <>
      <SiteHeader />

      <main className="min-h-screen bg-canvas text-chalk">
        {/* ============ IMMERSIVE HERO ============ */}
        <section className="aurora relative overflow-hidden">
          <div className="gridlines absolute inset-0" aria-hidden />
          <div className="relative mx-auto flex max-w-5xl flex-col items-center px-5 pt-40 pb-28 text-center">
            <span className="rise d1 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm text-mist">
              <span className="h-1.5 w-1.5 rounded-full bg-chalk" aria-hidden /> Family eye care since 1998 · Kolar &amp; KGF
            </span>

            <div className="rise d2 mt-14 mb-4">
              <FocusHeadline lines={['See it all,', 'perfectly clear.']} lensX={50} lensY={50} lensR={148} />
            </div>

            <p className="rise d3 mt-8 max-w-xl text-lg leading-relaxed text-mist">
              Every frame fitted by a real optician and ready the same day — with lenses cut to your exact
              prescription and priced with nothing hidden.
            </p>

            <div className="rise d4 mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link href="/shop" className="min-h-12 rounded-full bg-chalk px-8 py-3.5 font-semibold text-void transition-transform hover:-translate-y-0.5">
                Explore frames · from {rupees(600)}
              </Link>
              <Link href="/book" className="min-h-12 rounded-full glass px-8 py-3.5 font-semibold text-chalk transition-colors hover:bg-white/5">
                Book free eye test
              </Link>
            </div>
          </div>

          {/* benefit divider strip */}
          <div className="relative border-y border-line">
            <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-line sm:grid-cols-4">
              {benefits.map((b) => (
                <div key={b} className="px-5 py-5 text-center text-sm text-mist">
                  {b}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ BENTO GRID ============ */}
        <section className="mx-auto max-w-6xl px-5 py-8">
          <div className="grid auto-rows-[minmax(180px,auto)] grid-cols-2 gap-4 lg:grid-cols-4">
            {/* Eyeglasses — big tile */}
            <Link
              href="/shop?category=frames"
              className="group relative col-span-2 row-span-2 flex flex-col justify-between overflow-hidden rounded-2xl glass p-7 transition-transform hover:-translate-y-1"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-30 blur-3xl aurora-fill" aria-hidden />
              <div className="relative flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-widest text-teal">Bestselling</span>
                <span className="rounded-full glass px-3 py-1 text-xs text-mist">From {rupees(600)}</span>
              </div>
              <ShapeIcon d="rect" className="relative mx-auto my-4 w-40 text-chalk/80" />
              <div className="relative">
                <h2 className="font-display text-4xl">Eyeglasses</h2>
                <p className="mt-1 flex items-center gap-2 text-mist">
                  Shop the full range
                  <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
                </p>
              </div>
            </Link>

            {/* At-home flagship — inverted white tile for contrast */}
            <Link
              href="/at-home"
              className="group relative col-span-2 flex flex-col justify-between overflow-hidden rounded-2xl bg-chalk p-7 text-void transition-transform hover:-translate-y-1"
            >
              <div className="flex items-start justify-between">
                <span className="font-mono text-xs uppercase tracking-widest text-void/60">At-home service</span>
                <span className="rounded-full bg-void px-3 py-1 text-xs font-semibold text-chalk">₹150 · refundable</span>
              </div>
              <div className="mt-6">
                <h2 className="font-display text-3xl">Eye test &amp; frame trial at your home</h2>
                <p className="mt-1 flex items-center gap-2 font-medium text-void/70">
                  150+ frames, 12-step checkup
                  <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
                </p>
              </div>
            </Link>

            {/* Readers */}
            <Link href="/shop?category=readers" className="group flex flex-col justify-between rounded-2xl glass p-6 transition-transform hover:-translate-y-1">
              <ShapeIcon d="round" className="w-16 text-chalk/70" />
              <div>
                <h3 className="font-display text-2xl">Readers</h3>
                <p className="text-sm text-mist">From {rupees(600)}</p>
              </div>
            </Link>

            {/* Contacts */}
            <Link href="/shop?category=contacts" className="group flex flex-col justify-between rounded-2xl glass p-6 transition-transform hover:-translate-y-1">
              <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-chalk/40" aria-hidden>
                <span className="h-7 w-7 rounded-full border border-chalk/40" />
              </span>
              <div>
                <h3 className="font-display text-2xl">Contacts</h3>
                <p className="text-sm text-mist">From {rupees(250)}</p>
              </div>
            </Link>
          </div>
        </section>

        {/* ============ SHOP BY SHAPE ============ */}
        <section className="mx-auto max-w-6xl px-5 py-10">
          <h2 className="mb-6 font-display text-2xl text-chalk">Shop by shape</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {shapes.map((s) => (
              <Link key={s.q} href={`/shop?shape=${s.q}`} className="flex items-center gap-3 rounded-2xl glass px-5 py-4 transition-colors hover:bg-white/5">
                <ShapeIcon d={s.d} className="w-12 text-chalk/70" />
                <span className="text-base">{s.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ============ LIVE PRODUCT RAIL ============ */}
        <ProductRow title="Bestsellers" href="/shop" />

        {/* ============ PROOF STRIP ============ */}
        <section className="mx-auto max-w-6xl px-5 py-12">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { q: 'Got my glasses the same afternoon. The home eye-test was so convenient for my mother.', n: 'Lakshmi R.', p: 'Kolar' },
              { q: 'Honest pricing — they showed me the lens cost before I paid. No surprises.', n: 'Imran S.', p: 'KGF' },
              { q: '27 years my family has trusted them. Now I reorder my son’s lenses online.', n: 'Prakash M.', p: 'Robertsonpet' },
            ].map((r) => (
              <figure key={r.n} className="flex flex-col gap-4 rounded-2xl glass p-6">
                <div className="text-amber" aria-hidden>★★★★★</div>
                <blockquote className="leading-relaxed text-chalk">“{r.q}”</blockquote>
                <figcaption className="mt-auto text-sm text-mist"><span className="text-chalk">{r.n}</span> · {r.p}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* ============ HONEST PRICING PLEDGE ============ */}
        <section className="mx-auto max-w-6xl px-5 py-12">
          <div className="relative overflow-hidden rounded-2xl glass-strong p-8 sm:p-12">
            <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full opacity-20 blur-3xl aurora-fill" aria-hidden />
            <h2 className="relative font-display text-3xl sm:text-5xl">Honest pricing, always.</h2>
            <p className="relative mt-4 max-w-2xl text-lg leading-relaxed text-mist">
              Some companies lure you with fancy offers, then quietly empty your pocket. We don’t. You pay for
              exactly what you choose — the frame and lens you want. Nothing hidden.
            </p>
            <ul className="relative mt-8 grid gap-4 sm:grid-cols-3">
              {['No subscriptions', 'No “buy 1 get 1” gimmicks', 'No hidden charges — price shown before you pay'].map((i) => (
                <li key={i} className="flex items-start gap-2.5 text-chalk">
                  <span className="mt-1 text-teal" aria-hidden>✕</span> {i}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ============ FOOTER ============ */}
        <footer className="mt-8 border-t border-line">
          <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="aurora-fill h-4 w-4 rounded-full" aria-hidden />
                <span className="font-display text-lg">The Best Opticals</span>
              </div>
              <p className="mt-3 text-sm text-mist">Family eye care since 1998. KGF & RL Jalappa Hospital, Kolar.</p>
            </div>
            <FooterCol title="Shop" links={[['Eyeglasses', '/shop?category=frames'], ['Readers', '/shop?category=readers'], ['Contacts', '/shop?category=contacts']]} />
            <FooterCol title="Services" links={[['Book an eye test', '/book'], ['At-home visit', '/at-home'], ['Virtual try-on', '/tryon']]} />
            <div>
              <div className="text-sm font-semibold text-chalk">Visit us</div>
              <ul className="mt-3 flex flex-col gap-2 text-sm text-mist">
                <li>KGF — Robertsonpet</li>
                <li>RL Jalappa Hospital, Kolar</li>
                <li>Mon–Sat · 10am–8pm</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-line">
            <div className="mx-auto max-w-6xl px-5 py-5 text-xs text-faint">© 1998–2026 The Best Opticals · No hidden charges, ever.</div>
          </div>
        </footer>
      </main>
    </>
  )
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <div className="text-sm font-semibold text-chalk">{title}</div>
      <ul className="mt-3 flex flex-col gap-2 text-sm text-mist">
        {links.map(([label, href]) => (
          <li key={href}><Link href={href} className="hover:text-chalk">{label}</Link></li>
        ))}
      </ul>
    </div>
  )
}

// inline frame-shape icons
function ShapeIcon({ d, className = '' }: { d: 'rect' | 'round' | 'square' | 'cat'; className?: string }) {
  const c = { fill: 'none', stroke: 'currentColor', strokeWidth: 5, strokeLinejoin: 'round' as const }
  return (
    <svg viewBox="0 0 160 70" className={className} aria-hidden>
      {d === 'round' ? (
        <><circle cx="42" cy="35" r="26" {...c} /><circle cx="118" cy="35" r="26" {...c} /></>
      ) : d === 'cat' ? (
        <><path d="M14 26 q4 24 34 24 q26 0 26-22 q-30 -8 -60 -2Z" {...c} /><path d="M146 26 q-4 24 -34 24 q-26 0 -26-22 q30 -8 60 -2Z" {...c} /></>
      ) : (
        <><rect x="14" y="16" width="56" height="40" rx={d === 'square' ? 8 : 16} {...c} /><rect x="90" y="16" width="56" height="40" rx={d === 'square' ? 8 : 16} {...c} /></>
      )}
      <path d="M70 34 h20" {...c} />
    </svg>
  )
}

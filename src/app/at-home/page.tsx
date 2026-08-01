import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'

// At-home eye test + frame trial — Swiss/brutalist to match home.
// ₹150/person, fully refundable on purchase. Optician visits with 150+ frames.
export default async function AtHomePage() {
  const t = await getTranslations('athome')

  const eligibility = [t('elig1'), t('elig3')]
  const expect = [t('expect1'), t('expect2'), t('expect3')]
  const steps = [t('step1'), t('step2'), t('step3'), t('step4')]

  return (
    <>
      <SiteHeader />
      <main className="bg-canvas text-void">
        {/* ===== HERO (inverted band) ===== */}
        <section className="border-b border-void bg-void text-canvas">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
            <div className="flex items-center justify-between border-b border-canvas/15 py-3">
              <span className="label text-accent">{t('badge')}</span>
              <span className="label text-canvas/50">Kolar &amp; KGF</span>
            </div>
            <div className="grid gap-8 py-14 lg:grid-cols-[1.4fr_1fr] lg:items-end">
              <div>
                <h1 className="huge text-5xl sm:text-7xl">{t('title')}</h1>
                <p className="mt-6 max-w-lg text-lg text-canvas/70">{t('sub')}</p>
                <Link
                  href="/book?mode=home"
                  className="mt-8 inline-flex items-center gap-3 border border-canvas px-6 py-4 font-display text-xl transition-colors hover:bg-canvas hover:text-void"
                >
                  {t('book')} <span aria-hidden>→</span>
                </Link>
              </div>
              {/* fee card */}
              <div className="border border-canvas/30 p-8">
                <div className="huge text-7xl">₹150</div>
                <p className="mt-3 text-canvas/70">{t('feeNote')}</p>
                <div className="my-6 h-px bg-canvas/20" />
                <p className="label text-accent">150+ frames · 12-step checkup</p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== ELIGIBILITY + EXPECT (two columns, ruled) ===== */}
        <section className="mx-auto max-w-[1400px] border-x border-void">
          <div className="grid gap-px bg-void md:grid-cols-2">
            <div className="bg-canvas p-8">
              <span className="label text-accent">Who it&apos;s for</span>
              <h2 className="huge mt-3 text-3xl">{t('eligTitle')}</h2>
              <ul className="mt-6 flex flex-col">
                {eligibility.map((e, i) => (
                  <li key={i} className={`flex gap-4 py-4 ${i > 0 ? 'border-t border-void/15' : ''}`}>
                    <span className="label shrink-0 text-faint">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-base leading-relaxed text-mist">{e}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-canvas p-8">
              <span className="label text-accent">What to expect</span>
              <h2 className="huge mt-3 text-3xl">{t('expectTitle')}</h2>
              <ul className="mt-6 flex flex-col">
                {expect.map((e, i) => (
                  <li key={i} className={`flex gap-4 py-4 ${i > 0 ? 'border-t border-void/15' : ''}`}>
                    <span className="shrink-0 text-accent" aria-hidden>✦</span>
                    <span className="text-base leading-relaxed text-mist">{e}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ===== HOW IT WORKS (numbered grid) ===== */}
        <section className="mx-auto max-w-[1400px] border-x border-t border-void">
          <div className="flex items-baseline gap-4 px-8 pt-10 pb-6">
            <span className="label text-accent">STEPS</span>
            <h2 className="huge text-4xl sm:text-5xl">{t('stepsTitle')}</h2>
          </div>
          <div className="grid gap-px border-t border-void bg-void sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={i} className="bg-canvas p-8">
                <span className="huge text-5xl text-void/20">{String(i + 1).padStart(2, '0')}</span>
                <p className="mt-4 text-base leading-relaxed">{s}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== AREAS + CTA ===== */}
        <section className="mx-auto max-w-[1400px] border-x border-y border-void bg-void text-canvas">
          <div className="flex flex-col justify-between gap-6 p-8 sm:flex-row sm:items-end sm:p-12">
            <div>
              <span className="label text-accent">Where we visit</span>
              <h2 className="huge mt-3 text-3xl sm:text-4xl">{t('areasTitle')}</h2>
              <p className="mt-3 max-w-xl text-canvas/70">{t('areas')}</p>
            </div>
            <Link
              href="/book?mode=home"
              className="inline-flex shrink-0 items-center gap-3 border border-canvas px-6 py-4 font-display text-xl transition-colors hover:bg-canvas hover:text-void"
            >
              {t('book')} <span aria-hidden>→</span>
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}

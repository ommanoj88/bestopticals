import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'

// At-home eye test + frame trial. ₹150/person, fully refundable on purchase.
// Optician visits with 150+ frames. Mirrors Lenskart-at-Home but local + honest.
export default async function AtHomePage() {
  const t = await getTranslations('athome')

  const eligibility = [t('elig1'), t('elig3')]
  const expect = [t('expect1'), t('expect2'), t('expect3')]
  const steps = [t('step1'), t('step2'), t('step3'), t('step4')]

  return (
    <>
      <SiteHeader />
      <main className="bg-paper pt-16">
        {/* hero */}
        <section className="bg-ink text-chalk">
          <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-16 lg:grid-cols-2">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-teal">{t('badge')}</p>
              <h1 className="mt-4 font-display text-5xl leading-[1.03] sm:text-6xl">{t('title')}</h1>
              <p className="mt-5 max-w-md text-lg text-mist">{t('sub')}</p>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <Link
                  href="/book?mode=home"
                  className="min-h-12 rounded-full bg-chalk px-7 py-3 text-base font-semibold text-night transition-transform hover:-translate-y-0.5"
                >
                  {t('book')}
                </Link>
                <div>
                  <div className="font-mono text-xl text-chalk">{t('fee')}</div>
                  <div className="text-sm text-teal">{t('feeNote')}</div>
                </div>
              </div>
            </div>
            {/* refundable-fee highlight card */}
            <div className="relative overflow-hidden rounded-lens border border-line-night bg-night-2 p-8">
              <div className="sheen pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full opacity-30 blur-3xl" aria-hidden />
              <div className="relative">
                <div className="font-display text-6xl">₹150</div>
                <p className="mt-2 text-mist">{t('feeNote')}</p>
                <div className="mt-6 h-px bg-line-night" />
                <p className="mt-4 font-mono text-sm text-teal">150+ frames · 12-step checkup</p>
              </div>
            </div>
          </div>
        </section>

        {/* eligibility + what to expect */}
        <section className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl text-ink">{t('eligTitle')}</h2>
            <ul className="mt-6 flex flex-col gap-4">
              {eligibility.map((e, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-1 h-5 w-5 shrink-0 rounded-full border-2 border-teal" aria-hidden />
                  <span className="text-base leading-relaxed text-ink-soft">{e}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-3xl text-ink">{t('expectTitle')}</h2>
            <ul className="mt-6 flex flex-col gap-4">
              {expect.map((e, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal text-[11px] font-bold text-white">
                    ✓
                  </span>
                  <span className="text-base leading-relaxed text-ink-soft">{e}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* how it works */}
        <section className="border-t border-line bg-paper-2">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <h2 className="mb-10 font-display text-3xl text-ink sm:text-4xl">{t('stepsTitle')}</h2>
            <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s, i) => (
                <li key={i} className="rounded-lens border border-line bg-card p-6">
                  <span className="font-mono text-sm text-teal">{String(i + 1).padStart(2, '0')}</span>
                  <p className="mt-3 text-base leading-relaxed text-ink">{s}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* areas + CTA */}
        <section className="mx-auto max-w-6xl px-5 py-16">
          <div className="rounded-lens border border-line bg-card p-8 sm:p-10">
            <h2 className="font-display text-2xl text-ink">{t('areasTitle')}</h2>
            <p className="mt-3 max-w-2xl text-base text-ink-soft">{t('areas')}</p>
            <Link
              href="/book?mode=home"
              className="mt-6 inline-flex min-h-12 items-center rounded-full bg-ink px-7 py-3 text-base font-semibold text-paper transition-transform hover:-translate-y-0.5"
            >
              {t('book')}
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}

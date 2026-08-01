import { getTranslations } from 'next-intl/server'
import { listProducts, filterFacets, heroImagesFor } from '@/lib/catalog/queries'
import type { CatalogFilters } from '@/lib/catalog/types'
import { ProductCard } from '@/components/ProductCard'
import { FilterBar } from '@/components/FilterBar'
import { SiteHeader } from '@/components/SiteHeader'

// Zero-login catalog. Filters come from the URL query (?shape=&material=&...).
export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const t = await getTranslations('shop')

  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)
  const filters: CatalogFilters = {
    category: one(sp.category),
    shape: one(sp.shape),
    material: one(sp.material),
    size: one(sp.size),
    color: one(sp.color),
    gender: one(sp.gender),
    min: one(sp.min) ? Number(one(sp.min)) : undefined,
    max: one(sp.max) ? Number(one(sp.max)) : undefined,
  }

  const [products, facets] = await Promise.all([listProducts(filters), filterFacets()])
  const imagesByProduct = await heroImagesFor(products.map((p) => p.id))

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 pb-12 pt-24">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="font-display text-4xl text-ink sm:text-5xl">{t('title')}</h1>
          <span className="rounded-full bg-paper-2 px-3 py-1 text-sm text-ink-soft">
            {t('count', { n: products.length })}
          </span>
        </div>

        <div className="mt-6 rounded-lens border border-line bg-card p-4">
          <FilterBar facets={facets} />
        </div>

        <div className="mt-8">
          {products.length === 0 ? (
            <p className="py-24 text-center text-lg text-ink-soft">{t('empty')}</p>
          ) : (
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} images={imagesByProduct[p.id] ?? []} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}

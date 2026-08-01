import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { listProducts, heroImagesFor } from '@/lib/catalog/queries'
import { ProductCard } from '@/components/ProductCard'

// A titled row of real products pulled from the catalog (prices + images).
// This is what makes the home read as a SHOP, not a landing page.
export async function ProductRow({ title, href, bare = false }: { title: string; href: string; bare?: boolean }) {
  const products = (await listProducts({})).slice(0, 4)
  const images = await heroImagesFor(products.map((p) => p.id))
  const t = await getTranslations('store')

  if (products.length === 0) return null

  // bare = no heading/padding (used when a parent SectionHead already frames it)
  if (bare) {
    return (
      <div className="grid grid-cols-2 gap-px bg-void md:grid-cols-4">
        {products.map((p) => (
          <div key={p.id} className="bg-canvas">
            <ProductCard product={p} images={images[p.id] ?? []} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-12">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="font-display text-3xl text-chalk sm:text-4xl">{title}</h2>
        <Link href={href} className="text-sm font-medium text-mist underline-offset-4 hover:text-chalk hover:underline">
          {t('viewAll')} →
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} images={images[p.id] ?? []} />
        ))}
      </div>
    </section>
  )
}

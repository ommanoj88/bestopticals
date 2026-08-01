import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { getProduct, getProductImages, listVisionTypes, listCoatings } from '@/lib/catalog/queries'
import { ProductThumb } from '@/components/ProductThumb'
import { LensPicker } from '@/components/LensPicker'
import { SiteHeader } from '@/components/SiteHeader'
import { rupees } from '@/lib/money'

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const t = await getTranslations('shop')

  const product = await getProduct(id)
  if (!product) notFound()

  const [images, visionTypes, coatings] = await Promise.all([
    getProductImages(id),
    listVisionTypes(),
    listCoatings(),
  ])

  // Clinical spec, monospaced: lens▯bridge · temple. Measurements read as data.
  const dims =
    product.lens_width_mm && product.bridge_mm && product.temple_mm
      ? `${product.lens_width_mm}▯${product.bridge_mm} · ${product.temple_mm}`
      : null
  const traits = [product.frame_shape, product.material, product.color, product.size_class].filter(Boolean)

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 pb-10 pt-20">
        <Link
          href="/shop"
          className="inline-flex min-h-9 items-center text-sm text-ink-soft hover:text-ink"
        >
          ← {t('back')}
        </Link>

        <div className="mt-4 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          {/* Image */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductThumb images={images} name={product.name} width={900} />
          </div>

          {/* Detail + configurator */}
          <div className="flex flex-col gap-7">
            <div>
              <h1 className="font-display text-4xl leading-tight text-ink">{product.name}</h1>
              <p className="mt-2 flex items-baseline gap-2.5">
                <span className="text-2xl font-semibold text-ink">{rupees(product.price_inr)}</span>
                {product.mrp_inr && product.mrp_inr > product.price_inr && (
                  <span className="text-base text-ink-soft line-through">{rupees(product.mrp_inr)}</span>
                )}
                <span className="text-sm text-ink-soft">· {t('frame')}</span>
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {traits.map((tr) => (
                  <span
                    key={tr}
                    className="rounded-full bg-paper-sink px-3 py-1 text-sm capitalize text-ink-soft"
                  >
                    {tr}
                  </span>
                ))}
                {dims && (
                  <span className="rounded-full border border-line px-3 py-1 font-mono text-xs text-ink-soft">
                    {dims} mm
                  </span>
                )}
              </div>
            </div>

            <div className="rounded-lens border border-line bg-card p-6">
              <LensPicker product={product} visionTypes={visionTypes} coatings={coatings} />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

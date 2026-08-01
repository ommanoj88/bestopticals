import { createClient } from '@/lib/supabase/server'
import type { CatalogFilters, Product, ProductImage } from './types'
import type { VisionType, Coating } from '@/lib/lens'

const PRODUCT_COLS =
  'id,name,brand,category,gender,price_inr,mrp_inr,frame_shape,material,color,size_class,lens_width_mm,bridge_mm,temple_mm,total_width_mm'

// Catalog list, RLS-filtered to active products (public read — no login).
export async function listProducts(f: CatalogFilters): Promise<Product[]> {
  const supabase = await createClient()
  let q = supabase.from('products').select(PRODUCT_COLS).order('created_at', { ascending: false })

  if (f.category) q = q.eq('category', f.category)
  if (f.shape) q = q.eq('frame_shape', f.shape)
  if (f.material) q = q.eq('material', f.material)
  if (f.size) q = q.eq('size_class', f.size)
  if (f.color) q = q.eq('color', f.color)
  if (f.gender) q = q.eq('gender', f.gender)
  if (typeof f.min === 'number') q = q.gte('price_inr', f.min)
  if (typeof f.max === 'number') q = q.lte('price_inr', f.max)

  const { data, error } = await q
  if (error) throw error
  return (data ?? []) as Product[]
}

// Distinct facet values for the filter UI (from active products only).
export async function filterFacets() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('frame_shape,material,size_class,color,gender,category')
  if (error) throw error
  const uniq = (key: string) =>
    [...new Set((data ?? []).map((r) => (r as Record<string, string | null>)[key]).filter(Boolean))].sort() as string[]
  return {
    shape: uniq('frame_shape'),
    material: uniq('material'),
    size: uniq('size_class'),
    color: uniq('color'),
    gender: uniq('gender'),
    category: uniq('category'),
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('products').select(PRODUCT_COLS).eq('id', id).maybeSingle()
  if (error) throw error
  return (data as Product) ?? null
}

export async function getProductImages(id: string): Promise<ProductImage[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('product_images')
    .select('storage_key,sort,is_hero,lqip')
    .eq('product_id', id)
    .order('sort')
  if (error) throw error
  return (data ?? []) as ProductImage[]
}

// Hero image per product in ONE query (avoids N+1 on the catalog grid).
export async function heroImagesFor(ids: string[]): Promise<Record<string, ProductImage[]>> {
  if (ids.length === 0) return {}
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('product_images')
    .select('product_id,storage_key,sort,is_hero,lqip')
    .in('product_id', ids)
    .order('sort')
  if (error) throw error
  const byProduct: Record<string, ProductImage[]> = {}
  for (const row of data ?? []) {
    const r = row as ProductImage & { product_id: string }
    ;(byProduct[r.product_id] ??= []).push({
      storage_key: r.storage_key,
      sort: r.sort,
      is_hero: r.is_hero,
      lqip: r.lqip,
    })
  }
  return byProduct
}

// Vision types (with power bands) + coatings — public read, powers the picker.
export async function listVisionTypes(): Promise<VisionType[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('vision_types')
    .select('id,name,description,needs_add,needs_pd,sort,vision_prices(power_min,power_max,price_inr,active)')
    .eq('active', true)
    .order('sort')
  if (error) throw error
  return (data ?? []).map((vt) => {
    const row = vt as typeof vt & {
      vision_prices: { power_min: number; power_max: number; price_inr: number; active: boolean }[]
    }
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      needs_add: row.needs_add,
      needs_pd: row.needs_pd,
      bands: (row.vision_prices ?? [])
        .filter((b) => b.active)
        .map(({ power_min, power_max, price_inr }) => ({ power_min, power_max, price_inr }))
        .sort((a, b) => a.power_min - b.power_min),
    }
  })
}

export async function listCoatings(): Promise<Coating[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('lens_coatings')
    .select('id,name,description,price_inr')
    .eq('active', true)
    .order('sort')
  if (error) throw error
  return (data ?? []) as Coating[]
}


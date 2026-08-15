import { supabase } from './supabase'

export type Product = {
  id: string
  name: string
  brand: string | null
  category: string | null
  gender: string | null
  price_inr: number
  mrp_inr: number | null
  frame_shape: string | null
  material: string | null
  color: string | null
  size_class: string | null
  lens_width_mm: number | null
  bridge_mm: number | null
  temple_mm: number | null
  total_width_mm: number | null
}

export type CatalogFilters = { category?: string; shape?: string; max?: number }

const COLS =
  'id,name,brand,category,gender,price_inr,mrp_inr,frame_shape,material,color,size_class,lens_width_mm,bridge_mm,temple_mm,total_width_mm'

// Public catalog read (RLS: active products only). No login required.
export async function listProducts(f: CatalogFilters = {}): Promise<Product[]> {
  let q = supabase.from('products').select(COLS).order('created_at', { ascending: false })
  if (f.category) q = q.eq('category', f.category)
  if (f.shape) q = q.eq('frame_shape', f.shape)
  if (typeof f.max === 'number') q = q.lte('price_inr', f.max)
  const { data, error } = await q
  if (error) throw error
  return (data ?? []) as Product[]
}

export async function getProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase.from('products').select(COLS).eq('id', id).maybeSingle()
  if (error) throw error
  return (data as Product) ?? null
}

export type VisionType = {
  id: string
  name: string
  description: string | null
  bands: { power_min: number; power_max: number; price_inr: number }[]
}

// Lens vision types + their admin-priced power bands (public read).
export async function listVisionTypes(): Promise<VisionType[]> {
  const { data, error } = await supabase
    .from('vision_types')
    .select('id,name,description,sort,vision_prices(power_min,power_max,price_inr,active)')
    .eq('active', true)
    .order('sort')
  if (error) throw error
  return (data ?? []).map((r) => {
    const row = r as typeof r & {
      vision_prices: { power_min: number; power_max: number; price_inr: number; active: boolean }[]
    }
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      bands: (row.vision_prices ?? [])
        .filter((b) => b.active)
        .map(({ power_min, power_max, price_inr }) => ({ power_min, power_max, price_inr }))
        .sort((a, b) => a.power_min - b.power_min),
    }
  })
}

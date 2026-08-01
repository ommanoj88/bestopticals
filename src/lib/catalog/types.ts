// Catalog types — mirror the products/lens tables we read in W1.
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

export type ProductImage = {
  storage_key: string
  sort: number
  is_hero: boolean
  lqip: string | null
}

// Lens model lives in src/lib/lens.ts (VisionType, Coating, quoteLens).

// Filters, all optional — reflect ?shape=&material=&size=&color=&gender=&min=&max=
export type CatalogFilters = {
  category?: string
  shape?: string
  material?: string
  size?: string
  color?: string
  gender?: string
  min?: number
  max?: number
}

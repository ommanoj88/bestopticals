// Lens pricing — TWO dimensions (see migration 0001 lens section):
//   1. vision type (Single Vision / Bifocal / Progressive) → BASE price, banded
//      by power. Bifocal + Progressive need ADD; Progressive also needs PD.
//   2. coatings (Blu-Cut, Polycarbonate…) → flat add-ons on top.
// Power band = higher of |SPH| or |CYL| across both eyes (shop convention).
// Admin sets every price; a missing band returns null (never guess a price).

export type PriceBand = {
  power_min: number
  power_max: number
  price_inr: number
}

export type VisionType = {
  id: string
  name: string
  description: string | null
  needs_add: boolean
  needs_pd: boolean
  bands: PriceBand[]
}

export type Coating = {
  id: string
  name: string
  description: string | null
  price_inr: number
}

export type RxPowers = {
  od_sph?: number | null
  od_cyl?: number | null
  os_sph?: number | null
  os_cyl?: number | null
  od_add?: number | null
  os_add?: number | null
  distance_pd?: number | null
}

// Power band = strongest absolute dioptre across SPH/CYL, both eyes (0 = plano).
export function matchingPower(rx: RxPowers): number {
  const vals = [rx.od_sph, rx.od_cyl, rx.os_sph, rx.os_cyl]
    .filter((v): v is number => typeof v === 'number')
    .map(Math.abs)
  return vals.length ? Math.max(...vals) : 0
}

// Base price for a power from a vision type's bands. null if uncovered.
export function priceForPower(power: number, bands: PriceBand[]): number | null {
  const hit = bands.find((b) => power >= b.power_min && power <= b.power_max)
  return hit ? hit.price_inr : null
}

// What the customer still needs to supply for this vision type before we can
// quote/order. Returns a list of missing-field messages (empty = ready).
export function missingForVision(vision: VisionType, rx: RxPowers): string[] {
  const miss: string[] = []
  if (vision.needs_add && rx.od_add == null && rx.os_add == null) {
    miss.push('ADD power (near addition) is required for this lens')
  }
  if (vision.needs_pd && rx.distance_pd == null) {
    miss.push('PD (pupillary distance) is required for progressive lenses')
  }
  return miss
}

export type LensQuote = {
  power: number
  basePriceInr: number | null // null → no admin band covers this power
  coatingsPriceInr: number
  totalInr: number | null // null if base is null
  missing: string[]
}

// Full lens quote: vision base (by power band) + chosen coatings.
export function quoteLens(
  vision: VisionType,
  coatings: Coating[],
  rx: RxPowers,
): LensQuote {
  const power = matchingPower(rx)
  const basePriceInr = priceForPower(power, vision.bands)
  const coatingsPriceInr = coatings.reduce((s, c) => s + c.price_inr, 0)
  const missing = missingForVision(vision, rx)
  const totalInr = basePriceInr === null ? null : basePriceInr + coatingsPriceInr
  return { power, basePriceInr, coatingsPriceInr, totalInr, missing }
}

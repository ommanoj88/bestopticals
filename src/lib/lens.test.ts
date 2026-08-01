import { matchingPower, priceForPower, quoteLens, missingForVision, type VisionType, type Coating } from './lens'
import assert from 'node:assert/strict'

// run: npx tsx src/lib/lens.test.ts
const bands = [
  { power_min: 0, power_max: 2, price_inr: 300 },
  { power_min: 2.01, power_max: 4, price_inr: 700 },
  { power_min: 4.01, power_max: 8, price_inr: 1200 },
]
const sv: VisionType = { id: '1', name: 'Single Vision', description: null, needs_add: false, needs_pd: false, bands }
const prog: VisionType = { id: '3', name: 'Progressive', description: null, needs_add: true, needs_pd: true, bands: bands.map((b) => ({ ...b, price_inr: b.price_inr + 2200 })) }
const coatings: Coating[] = [
  { id: 'a', name: 'Blu-Cut', description: null, price_inr: 500 },
  { id: 'b', name: 'Anti-Glare', description: null, price_inr: 300 },
]

// power band = strongest |dioptre| across both eyes, sph or cyl
assert.equal(matchingPower({ od_sph: -1.25, os_sph: -3.5, os_cyl: -0.75 }), 3.5)
assert.equal(matchingPower({ od_cyl: -2.5, od_sph: -1 }), 2.5)
assert.equal(matchingPower({}), 0)

// band edges inclusive; gap → null (never guess)
assert.equal(priceForPower(2, bands), 300)
assert.equal(priceForPower(2.01, bands), 700)
assert.equal(priceForPower(9, bands), null)

// SV quote: base by power + coatings, no missing fields
const q1 = quoteLens(sv, coatings, { od_sph: -3.5 }) // 3.5 → 700 band
assert.equal(q1.basePriceInr, 700)
assert.equal(q1.coatingsPriceInr, 800)
assert.equal(q1.totalInr, 1500)
assert.deepEqual(q1.missing, [])

// Progressive needs ADD + PD → missing when absent
const q2 = quoteLens(prog, [], { od_sph: -1.0 })
assert.equal(q2.basePriceInr, 2500) // 1.0 → base 300 + 2200
assert.equal(q2.missing.length, 2) // ADD + PD

// Progressive satisfied when ADD + PD supplied
const q3 = quoteLens(prog, [], { od_sph: -1.0, od_add: 2.0, distance_pd: 62 })
assert.deepEqual(q3.missing, [])

// uncovered power → total null even with coatings
const q4 = quoteLens(sv, coatings, { od_sph: -10 })
assert.equal(q4.basePriceInr, null)
assert.equal(q4.totalInr, null)

// missingForVision direct
assert.equal(missingForVision(sv, {}).length, 0)

console.log('lens.test ok')

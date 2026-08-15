import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, Pressable, ActivityIndicator, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import type { ScreenProps } from '../navigation'
import { getProduct, listVisionTypes, type Product, type VisionType } from '../lib/catalog'
import { C } from '../lib/theme'
import { rupees } from '../lib/money'
import { useCart } from '../lib/cart'

export function ProductScreen({ route, navigation }: ScreenProps<'Product'>) {
  const { id } = route.params
  const { add } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [visions, setVisions] = useState<VisionType[]>([])
  const [visionId, setVisionId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    let alive = true
    Promise.all([getProduct(id), listVisionTypes()])
      .then(([p, v]) => { if (!alive) return; setProduct(p); setVisions(v) })
      .finally(() => alive && setLoading(false))
    return () => { alive = false }
  }, [id])

  if (loading) return <View style={s.center}><ActivityIndicator color={C.void} /></View>
  if (!product) return <View style={s.center}><Text style={{ color: C.mist }}>Frame not found.</Text></View>

  const vision = visions.find((v) => v.id === visionId)
  // show the vision type's cheapest band as a "from" indicator (exact price
  // needs the Rx power — captured at checkout).
  const visionFrom = vision && vision.bands.length ? Math.min(...vision.bands.map((b) => b.price_inr)) : null
  const total = product.price_inr + (visionFrom ?? 0)

  function addToCart() {
    if (!product) return
    add({
      productId: product.id,
      name: product.name,
      framePriceInr: product.price_inr,
      visionTypeName: vision?.name,
      lensPriceInr: visionFrom ?? undefined,
      qty: 1,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const dims =
    product.lens_width_mm && product.bridge_mm && product.temple_mm
      ? `${product.lens_width_mm}▯${product.bridge_mm} · ${product.temple_mm} mm`
      : null

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.topbar}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}><Text style={s.back}>← Back</Text></Pressable>
        <Pressable onPress={() => navigation.navigate('Cart')} hitSlop={10}><Text style={s.back}>Cart</Text></Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={s.image}><Text style={s.glyph}>▢▢</Text></View>

        <View style={s.body}>
          <Text style={s.name}>{product.name}</Text>
          <View style={s.priceRow}>
            <Text style={s.price}>{rupees(product.price_inr)}</Text>
            {product.mrp_inr && product.mrp_inr > product.price_inr ? (
              <Text style={s.mrp}>{rupees(product.mrp_inr)}</Text>
            ) : null}
            <Text style={s.frameLabel}>· Frame</Text>
          </View>
          <Text style={s.meta}>
            {[product.frame_shape, product.material, product.color, product.size_class].filter(Boolean).join(' · ')}
            {dims ? `  ·  ${dims}` : ''}
          </Text>

          {/* vision type picker */}
          <Text style={s.sectionLabel}>CHOOSE YOUR LENS</Text>
          {visions.map((v) => {
            const on = v.id === visionId
            const from = v.bands.length ? Math.min(...v.bands.map((b) => b.price_inr)) : null
            return (
              <Pressable key={v.id} onPress={() => setVisionId(on ? null : v.id)} style={[s.lensOpt, on && s.lensOptOn]}>
                <View style={{ flex: 1 }}>
                  <Text style={[s.lensName, on && s.lensNameOn]}>{v.name}</Text>
                  {v.description ? <Text style={[s.lensDesc, on && s.lensDescOn]}>{v.description}</Text> : null}
                </View>
                {from != null ? <Text style={[s.lensFrom, on && s.lensNameOn]}>from {rupees(from)}</Text> : null}
              </Pressable>
            )
          })}
          <Text style={s.note}>Exact lens price depends on your prescription power — confirmed at checkout or in shop.</Text>

          {/* total */}
          <View style={s.totalRow}>
            <Text style={s.totalLabel}>Total {vision ? '(from)' : ''}</Text>
            <Text style={s.totalValue}>{rupees(total)}</Text>
          </View>
        </View>
      </ScrollView>

      <Pressable style={[s.addBtn, added && { backgroundColor: C.accent }]} onPress={addToCart}>
        <Text style={s.addText}>{added ? 'Added ✓' : 'Add to cart'}</Text>
      </Pressable>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.canvas },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: C.canvas },
  topbar: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderColor: C.line },
  back: { fontSize: 14, fontWeight: '600', color: C.void },
  image: { aspectRatio: 4 / 3, backgroundColor: C.raised, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 1, borderColor: C.line },
  glyph: { fontSize: 60, color: C.faint, letterSpacing: 8 },
  body: { padding: 16, gap: 8 },
  name: { fontSize: 30, fontWeight: '700', color: C.void, letterSpacing: -0.5 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  price: { fontSize: 22, fontWeight: '700', color: C.void },
  mrp: { fontSize: 14, color: C.faint, textDecorationLine: 'line-through' },
  frameLabel: { fontSize: 13, color: C.mist },
  meta: { fontSize: 13, color: C.mist, textTransform: 'capitalize' },
  sectionLabel: { fontSize: 12, letterSpacing: 2, color: C.void, marginTop: 20, marginBottom: 4, fontWeight: '700' },
  lensOpt: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: C.line, padding: 14, marginTop: 8 },
  lensOptOn: { backgroundColor: C.void },
  lensName: { fontSize: 16, fontWeight: '600', color: C.void },
  lensNameOn: { color: C.canvas },
  lensDesc: { fontSize: 13, color: C.mist, marginTop: 2 },
  lensDescOn: { color: '#c9c6bf' },
  lensFrom: { fontSize: 14, color: C.mist },
  note: { fontSize: 12, color: C.faint, marginTop: 10, lineHeight: 17 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 20, borderTopWidth: 1, borderColor: C.line, paddingTop: 16 },
  totalLabel: { fontSize: 18, fontWeight: '700', color: C.void },
  totalValue: { fontSize: 24, fontWeight: '700', color: C.void },
  addBtn: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: C.void, padding: 20, alignItems: 'center' },
  addText: { color: C.canvas, fontSize: 18, fontWeight: '700' },
})

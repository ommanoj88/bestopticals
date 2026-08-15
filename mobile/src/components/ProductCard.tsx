import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import type { Product } from '../lib/catalog'
import { C } from '../lib/theme'
import { rupees } from '../lib/money'

// Swiss card: black hairline, sharp corners, mono-ish price, frame glyph.
export function ProductCard({ product, onPress }: { product: Product; onPress: () => void }) {
  const off =
    product.mrp_inr && product.mrp_inr > product.price_inr
      ? Math.round((1 - product.price_inr / product.mrp_inr) * 100)
      : 0
  return (
    <Pressable onPress={onPress} style={s.card}>
      <View style={s.thumb}>
        {off > 0 && (
          <Text style={s.badge}>{off}% OFF</Text>
        )}
        <Text style={s.glyph}>▢▢</Text>
      </View>
      <View style={s.body}>
        <Text style={s.name}>{product.name}</Text>
        <Text style={s.meta}>
          {[product.frame_shape, product.material].filter(Boolean).join(' · ')}
        </Text>
        <View style={s.priceRow}>
          <Text style={s.price}>{rupees(product.price_inr)}</Text>
          {product.mrp_inr && product.mrp_inr > product.price_inr ? (
            <Text style={s.mrp}>{rupees(product.mrp_inr)}</Text>
          ) : null}
        </View>
        <Text style={s.lens}>+ LENS FROM {rupees(300)}</Text>
      </View>
    </Pressable>
  )
}

const s = StyleSheet.create({
  card: { flex: 1, backgroundColor: C.card, borderWidth: 1, borderColor: C.line },
  thumb: {
    aspectRatio: 4 / 3, backgroundColor: C.raised, borderBottomWidth: 1, borderColor: C.line,
    alignItems: 'center', justifyContent: 'center',
  },
  glyph: { fontSize: 34, color: C.faint, letterSpacing: 4 },
  badge: {
    position: 'absolute', top: 0, left: 0, backgroundColor: C.accent, color: C.canvas,
    fontSize: 10, fontWeight: '700', paddingHorizontal: 6, paddingVertical: 3, letterSpacing: 1,
  },
  body: { padding: 12, gap: 4 },
  name: { fontSize: 17, fontWeight: '600', color: C.void },
  meta: { fontSize: 13, color: C.mist, textTransform: 'capitalize' },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginTop: 4 },
  price: { fontSize: 17, fontWeight: '700', color: C.void },
  mrp: { fontSize: 12, color: C.faint, textDecorationLine: 'line-through' },
  lens: { fontSize: 10, color: C.faint, letterSpacing: 1, marginTop: 2 },
})

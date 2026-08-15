import React from 'react'
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import type { ScreenProps } from '../navigation'
import { useCart } from '../lib/cart'
import { C } from '../lib/theme'
import { rupees } from '../lib/money'

export function CartScreen({ navigation }: ScreenProps<'Cart'>) {
  const { lines, remove, totalInr } = useCart()

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.topbar}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}><Text style={s.back}>← Back</Text></Pressable>
      </View>
      <Text style={s.title}>Cart</Text>

      {lines.length === 0 ? (
        <View style={s.empty}>
          <Text style={s.emptyText}>Your cart is empty.</Text>
          <Pressable style={s.shopBtn} onPress={() => navigation.navigate('Shop')}>
            <Text style={s.shopText}>Shop frames</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
            {lines.map((l, i) => (
              <View key={i} style={s.line}>
                <View style={{ flex: 1 }}>
                  <Text style={s.name}>{l.name}</Text>
                  <Text style={s.meta}>
                    {l.visionTypeName ?? 'Frame only'}
                    {typeof l.lensPriceInr === 'number' ? ` · Lens from ${rupees(l.lensPriceInr)}` : ''}
                  </Text>
                  <Pressable onPress={() => remove(i)} hitSlop={8}><Text style={s.remove}>Remove</Text></Pressable>
                </View>
                <Text style={s.linePrice}>{rupees((l.framePriceInr + (l.lensPriceInr ?? 0)) * l.qty)}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={s.footer}>
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>Total</Text>
              <Text style={s.totalValue}>{rupees(totalInr)}</Text>
            </View>
            <Pressable style={s.buy} disabled>
              <Text style={s.buyText}>Sign in to buy</Text>
            </Pressable>
            <Text style={s.note}>Checkout opens soon. Browsing needs no account.</Text>
          </View>
        </>
      )}
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.canvas },
  topbar: { padding: 16, borderBottomWidth: 1, borderColor: C.line },
  back: { fontSize: 14, fontWeight: '600', color: C.void },
  title: { fontSize: 34, fontWeight: '700', color: C.void, letterSpacing: -1, padding: 16 },
  empty: { alignItems: 'center', gap: 16, marginTop: 60 },
  emptyText: { fontSize: 16, color: C.mist },
  shopBtn: { backgroundColor: C.void, paddingHorizontal: 24, paddingVertical: 14 },
  shopText: { color: C.canvas, fontSize: 16, fontWeight: '600' },
  line: { flexDirection: 'row', gap: 12, borderWidth: 1, borderColor: C.line, padding: 14, backgroundColor: C.card },
  name: { fontSize: 17, fontWeight: '600', color: C.void },
  meta: { fontSize: 13, color: C.mist, marginTop: 2 },
  remove: { fontSize: 13, color: C.accent, marginTop: 8 },
  linePrice: { fontSize: 17, fontWeight: '700', color: C.void },
  footer: { borderTopWidth: 1, borderColor: C.line, padding: 16, gap: 12 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  totalLabel: { fontSize: 18, fontWeight: '700', color: C.void },
  totalValue: { fontSize: 24, fontWeight: '700', color: C.void },
  buy: { backgroundColor: C.void, padding: 18, alignItems: 'center', opacity: 0.5 },
  buyText: { color: C.canvas, fontSize: 17, fontWeight: '700' },
  note: { fontSize: 12, color: C.faint, textAlign: 'center' },
})

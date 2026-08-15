import React from 'react'
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import type { ScreenProps } from '../navigation'
import { C } from '../lib/theme'
import { rupees } from '../lib/money'
import { useCart } from '../lib/cart'

const CATEGORIES = [
  { label: 'Eyeglasses', category: 'frames', from: 600 },
  { label: 'Readers', category: 'readers', from: 600 },
  { label: 'Contacts', category: 'contacts', from: 250 },
]
const SHAPES = ['Rectangle', 'Round', 'Square', 'Cat-eye']
const PLEDGE = [
  ['No subscriptions', 'Never a recurring charge you didn’t ask for.'],
  ['No “buy 1 get 1” gimmicks', 'Tricks that quietly pad the bill. Not here.'],
  ['No hidden charges', 'Every price shown before you pay.'],
]

export function HomeScreen({ navigation }: ScreenProps<'Home'>) {
  const { count } = useCart()
  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* header */}
      <View style={s.header}>
        <Text style={s.brand}>The Best Opticals <Text style={{ color: C.accent }}>●</Text></Text>
        <Pressable onPress={() => navigation.navigate('Cart')} hitSlop={10}>
          <Text style={s.cart}>Cart{count > 0 ? ` (${count})` : ''}</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* hero */}
        <View style={s.hero}>
          <Text style={s.eyebrow}>SINCE 1998 · KOLAR & KGF</Text>
          <Text style={s.h1}>See it all,{'\n'}<Text style={{ color: C.accent }}>perfectly</Text> clear.</Text>
          <Text style={s.sub}>
            Every frame fitted and checked by a real optician, lenses cut to your exact prescription,
            priced with nothing hidden. From {rupees(600)}.
          </Text>
          <Pressable style={s.cta} onPress={() => navigation.navigate('Shop')}>
            <Text style={s.ctaText}>Explore frames</Text>
            <Text style={s.ctaText}>→</Text>
          </Pressable>
        </View>

        {/* ticker */}
        <View style={s.ticker}>
          <Text style={s.tickerText}>
            OPTICIAN-VERIFIED · SAME-DAY FITTING · NO HIDDEN CHARGES · 27 YEARS OF CARE
          </Text>
        </View>

        {/* categories */}
        <SectionHead n="01" title="Shop" />
        <View style={s.grid}>
          {CATEGORIES.map((c) => (
            <Pressable key={c.category} style={s.catCell} onPress={() => navigation.navigate('Shop', { category: c.category })}>
              <Text style={s.catLabel}>{c.label}</Text>
              <Text style={s.catFrom}>from {rupees(c.from)} →</Text>
            </Pressable>
          ))}
        </View>

        {/* by shape */}
        <SectionHead n="02" title="By shape" />
        <View style={s.shapeRow}>
          {SHAPES.map((sh) => (
            <Pressable
              key={sh}
              style={s.shapeCell}
              onPress={() => navigation.navigate('Shop', { shape: sh.toLowerCase() })}
            >
              <Text style={s.shapeText}>{sh}</Text>
            </Pressable>
          ))}
        </View>

        {/* honest pricing */}
        <SectionHead n="03" title="Honest pricing" />
        <View>
          {PLEDGE.map(([t, d]) => (
            <View key={t} style={s.pledge}>
              <Text style={s.pledgeX}>✕</Text>
              <View style={{ flex: 1 }}>
                <Text style={s.pledgeTitle}>{t}</Text>
                <Text style={s.pledgeDesc}>{d}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

function SectionHead({ n, title }: { n: string; title: string }) {
  return (
    <View style={s.secHead}>
      <Text style={s.secN}>{n}</Text>
      <Text style={s.secTitle}>{title}</Text>
    </View>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.canvas },
  header: {
    height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, borderBottomWidth: 1, borderColor: C.line,
  },
  brand: { fontSize: 18, fontWeight: '700', color: C.void },
  cart: { fontSize: 14, fontWeight: '600', color: C.void },
  hero: { padding: 20, gap: 14 },
  eyebrow: { fontSize: 11, letterSpacing: 2, color: C.mist },
  h1: { fontSize: 44, fontWeight: '700', lineHeight: 46, color: C.void, letterSpacing: -1 },
  sub: { fontSize: 16, lineHeight: 24, color: C.mist },
  cta: {
    flexDirection: 'row', justifyContent: 'space-between', backgroundColor: C.void,
    paddingHorizontal: 20, paddingVertical: 16, marginTop: 4,
  },
  ctaText: { color: C.canvas, fontSize: 18, fontWeight: '600' },
  ticker: { backgroundColor: C.void, paddingVertical: 12, paddingHorizontal: 16 },
  tickerText: { color: C.canvas, fontSize: 11, letterSpacing: 1.5 },
  secHead: { flexDirection: 'row', alignItems: 'baseline', gap: 12, paddingHorizontal: 16, paddingTop: 28, paddingBottom: 12 },
  secN: { fontSize: 11, letterSpacing: 2, color: C.accent },
  secTitle: { fontSize: 30, fontWeight: '700', color: C.void, letterSpacing: -1 },
  grid: { borderTopWidth: 1, borderColor: C.line },
  catCell: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 22, borderBottomWidth: 1, borderColor: C.line,
  },
  catLabel: { fontSize: 26, fontWeight: '700', color: C.void, letterSpacing: -0.5 },
  catFrom: { fontSize: 12, letterSpacing: 1, color: C.mist },
  shapeRow: { flexDirection: 'row', flexWrap: 'wrap', borderLeftWidth: 1, borderTopWidth: 1, borderColor: C.line },
  shapeCell: {
    width: '50%', paddingVertical: 26, alignItems: 'center',
    borderRightWidth: 1, borderBottomWidth: 1, borderColor: C.line,
  },
  shapeText: { fontSize: 15, color: C.void },
  pledge: { flexDirection: 'row', gap: 12, padding: 16, borderTopWidth: 1, borderColor: C.line },
  pledgeX: { color: C.accent, fontSize: 16 },
  pledgeTitle: { fontSize: 18, fontWeight: '700', color: C.void },
  pledgeDesc: { fontSize: 14, color: C.mist, marginTop: 2 },
})

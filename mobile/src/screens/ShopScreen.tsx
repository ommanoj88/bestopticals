import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import type { ScreenProps } from '../navigation'
import { listProducts, type Product } from '../lib/catalog'
import { ProductCard } from '../components/ProductCard'
import { C } from '../lib/theme'

export function ShopScreen({ navigation, route }: ScreenProps<'Shop'>) {
  const { category, shape } = route.params ?? {}
  const [products, setProducts] = useState<Product[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    listProducts({ category, shape })
      .then((p) => alive && setProducts(p))
      .catch((e) => alive && setError(String(e?.message ?? e)))
    return () => { alive = false }
  }, [category, shape])

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.head}>
        <Text style={s.title}>Frames</Text>
        <Text style={s.count}>{products ? `${products.length} frames` : ' '}</Text>
      </View>

      {error ? (
        <Text style={s.msg}>Couldn’t load frames. {error}</Text>
      ) : !products ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={C.void} />
      ) : products.length === 0 ? (
        <Text style={s.msg}>No frames match this filter.</Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(p) => p.id}
          numColumns={2}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          renderItem={({ item }) => (
            <View style={{ flex: 1 }}>
              <ProductCard product={item} onPress={() => navigation.navigate('Product', { id: item.id })} />
            </View>
          )}
        />
      )}
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.canvas },
  head: { flexDirection: 'row', alignItems: 'baseline', gap: 10, padding: 16, borderBottomWidth: 1, borderColor: C.line },
  title: { fontSize: 34, fontWeight: '700', color: C.void, letterSpacing: -1 },
  count: { fontSize: 13, color: C.mist },
  msg: { padding: 24, color: C.mist, fontSize: 15 },
})

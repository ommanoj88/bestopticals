import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Guest cart, persisted to AsyncStorage (login required only at checkout later).
export type CartLine = {
  productId: string
  name: string
  framePriceInr: number
  visionTypeName?: string
  lensPriceInr?: number
  qty: number
}

type CartCtx = {
  lines: CartLine[]
  add: (l: CartLine) => void
  remove: (i: number) => void
  clear: () => void
  count: number
  totalInr: number
}

const Ctx = createContext<CartCtx | null>(null)
const KEY = 'tbo_cart_v1'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => { if (raw) setLines(JSON.parse(raw)) })
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  useEffect(() => {
    if (loaded) AsyncStorage.setItem(KEY, JSON.stringify(lines)).catch(() => {})
  }, [lines, loaded])

  const add = useCallback((l: CartLine) => setLines((p) => [...p, l]), [])
  const remove = useCallback((i: number) => setLines((p) => p.filter((_, idx) => idx !== i)), [])
  const clear = useCallback(() => setLines([]), [])

  const count = lines.reduce((n, l) => n + l.qty, 0)
  const totalInr = lines.reduce((s, l) => s + (l.framePriceInr + (l.lensPriceInr ?? 0)) * l.qty, 0)

  return <Ctx.Provider value={{ lines, add, remove, clear, count, totalInr }}>{children}</Ctx.Provider>
}

export function useCart() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useCart must be used within CartProvider')
  return c
}

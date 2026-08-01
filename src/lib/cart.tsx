'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

// Guest cart: localStorage until checkout (login required only at buy — W2/W3).
// ponytail: localStorage + context, no store lib; swap for server cart when
// accounts land and cross-device carts matter.
export type CartLine = {
  productId: string
  name: string
  framePriceInr: number
  visionTypeId?: string
  visionTypeName?: string
  coatingNames?: string[]
  lensPriceInr?: number // vision base + coatings, snapshotted
  qty: number
}

type CartCtx = {
  lines: CartLine[]
  add: (line: CartLine) => void
  remove: (index: number) => void
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
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) setLines(JSON.parse(raw))
    } catch {
      // corrupt/absent → empty cart
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify(lines))
  }, [lines, loaded])

  const add = useCallback((line: CartLine) => setLines((p) => [...p, line]), [])
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

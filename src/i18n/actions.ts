'use server'

import { cookies } from 'next/headers'

// Persist the chosen locale in a cookie (read by src/i18n/request.ts).
export async function setLocale(locale: 'en' | 'kn') {
  const store = await cookies()
  store.set('locale', locale, { path: '/', maxAge: 60 * 60 * 24 * 365 })
}

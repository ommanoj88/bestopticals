import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'

const SUPPORTED = ['en', 'kn'] as const
type Locale = (typeof SUPPORTED)[number]

// Cookie-based locale (no URL prefix — fine for two languages).
export default getRequestConfig(async () => {
  const store = await cookies()
  const cookieLocale = store.get('locale')?.value
  const locale: Locale = SUPPORTED.includes(cookieLocale as Locale)
    ? (cookieLocale as Locale)
    : 'en'

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Server-side Supabase client bound to the request cookies (anon key, RLS-enforced).
// For trusted server logic that must bypass RLS (checkout, webhook, status transitions),
// use createServiceClient() below and RE-VERIFY the caller's role in code.
export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (toSet) => {
          try {
            toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // called from a Server Component — safe to ignore, middleware refreshes the session
          }
        },
      },
    },
  )
}

import { createClient as createRawClient } from '@supabase/supabase-js'

// Service-role client. Bypasses RLS. NEVER import into client code.
// Every endpoint using this MUST check the caller's role itself.
export function createServiceClient() {
  return createRawClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  )
}

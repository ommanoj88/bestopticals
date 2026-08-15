import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import Constants from 'expo-constants'

// Shared backend — same Supabase project the web app uses. Config comes from
// app.json → expo.extra (swap to your hosted project's URL/anon key for release).
const extra = (Constants.expoConfig?.extra ?? {}) as {
  supabaseUrl?: string
  supabaseAnonKey?: string
}

const url = extra.supabaseUrl ?? ''
const anon = extra.supabaseAnonKey ?? ''

// AsyncStorage-backed session (RN has no localStorage). Anon key only — RLS
// enforces access; no service role ever ships in the client.
export const supabase = createClient(url, anon, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

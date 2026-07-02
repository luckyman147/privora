import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '../types'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

const mem: Record<string, string> = {}

const safeStorage = {
  getItem:    (k: string) => { try { return localStorage.getItem(k) }    catch { return mem[k] ?? null } },
  setItem:    (k: string, v: string) => { try { localStorage.setItem(k, v) }    catch { mem[k] = v } },
  removeItem: (k: string) => { try { localStorage.removeItem(k) }              catch { delete mem[k] } },
}

export function createClient() {
  return createBrowserClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
    auth: { storage: safeStorage },
  })
}

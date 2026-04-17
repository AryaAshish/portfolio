import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { verifyPassword } from './hash'
import type { AuthUserRow, AuthRole } from './types'

let adminClient: SupabaseClient | null = null

function getAdminClient(): SupabaseClient {
  if (!adminClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) {
      throw new Error(
        'NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for auth lookup'
      )
    }
    adminClient = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  }
  return adminClient
}

export async function findUserByCredentials(
  username: string,
  password: string
): Promise<{ id: string; role: AuthRole } | null> {
  if (!username || !password) return null

  const { data, error } = await getAdminClient()
    .from('auth_users')
    .select('id, username, password_hash, role, created_at')
    .eq('username', username)
    .maybeSingle()

  if (error || !data) return null

  const row = data as AuthUserRow
  const ok = await verifyPassword(password, row.password_hash)
  if (!ok) return null

  return { id: row.id, role: row.role }
}

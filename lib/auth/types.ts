export type AuthRole = 'admin' | 'fittrack'

export interface AuthSession {
  userId: string
  role: AuthRole
  exp: number
}

export interface AuthUserRow {
  id: string
  username: string
  password_hash: string
  role: AuthRole
  created_at: string
}

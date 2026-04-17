import bcrypt from 'bcryptjs'

const COST = 10

export async function hashPassword(plain: string): Promise<string> {
  if (!plain) throw new Error('Password is required')
  return bcrypt.hash(plain, COST)
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  if (!plain || !hash) return false
  try {
    return await bcrypt.compare(plain, hash)
  } catch {
    return false
  }
}

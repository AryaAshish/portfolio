import type { AuthSession } from './types'

const ENCODER = new TextEncoder()

function b64urlEncode(bytes: Uint8Array): string {
  let str = ''
  for (let i = 0; i < bytes.length; i++) str += String.fromCharCode(bytes[i])
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function b64urlDecode(input: string): Uint8Array {
  const pad = input.length % 4 === 0 ? '' : '='.repeat(4 - (input.length % 4))
  const base64 = (input + pad).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  const out = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i)
  return out
}

function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i]
  return diff === 0
}

async function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    ENCODER.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

export async function signCookie(session: AuthSession): Promise<string> {
  const secret = process.env.AUTH_COOKIE_SECRET
  if (!secret) throw new Error('AUTH_COOKIE_SECRET is not set')
  const payload = b64urlEncode(ENCODER.encode(JSON.stringify(session)))
  const key = await importKey(secret)
  const sig = await crypto.subtle.sign('HMAC', key, ENCODER.encode(payload))
  return `${payload}.${b64urlEncode(new Uint8Array(sig))}`
}

export async function verifyCookie(raw: string | undefined | null): Promise<AuthSession | null> {
  if (!raw) return null
  const secret = process.env.AUTH_COOKIE_SECRET
  if (!secret) return null
  const dot = raw.lastIndexOf('.')
  if (dot <= 0 || dot === raw.length - 1) return null
  const payload = raw.slice(0, dot)
  const sigPart = raw.slice(dot + 1)

  let expectedSig: Uint8Array
  let providedSig: Uint8Array
  try {
    providedSig = b64urlDecode(sigPart)
    const key = await importKey(secret)
    const computed = await crypto.subtle.sign('HMAC', key, ENCODER.encode(payload))
    expectedSig = new Uint8Array(computed)
  } catch {
    return null
  }

  if (!constantTimeEqual(expectedSig, providedSig)) return null

  let session: AuthSession
  try {
    const decoded = new TextDecoder().decode(b64urlDecode(payload))
    session = JSON.parse(decoded)
  } catch {
    return null
  }

  if (
    !session ||
    typeof session.userId !== 'string' ||
    (session.role !== 'admin' && session.role !== 'fittrack') ||
    typeof session.exp !== 'number'
  ) {
    return null
  }

  if (Date.now() >= session.exp) return null

  return session
}

export function defaultExpiryMs(): number {
  return Date.now() + 90 * 24 * 60 * 60 * 1000
}

import { config } from 'dotenv'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { Client } from 'pg'
import bcrypt from 'bcryptjs'

config({ path: resolve(process.cwd(), '.env.local') })

function required(name: string): string {
  const v = process.env[name]
  if (!v) {
    console.error(`Missing required env var: ${name}`)
    process.exit(1)
  }
  return v
}

function buildConnectionString(): string {
  const explicit = process.env.PORTFOLIO_DB_URL
  if (explicit) return explicit

  const url = required('NEXT_PUBLIC_SUPABASE_URL')
  const password = required('SUPABASE_DB_PASSWORD')
  const match = url.match(/^https:\/\/([a-z0-9]+)\.supabase\.co/i)
  if (!match) {
    console.error(`Could not parse project ref from NEXT_PUBLIC_SUPABASE_URL: ${url}`)
    process.exit(1)
  }
  const ref = match[1]
  const encoded = encodeURIComponent(password)
  return `postgresql://postgres:${encoded}@db.${ref}.supabase.co:5432/postgres`
}

async function main() {
  const adminUsername = required('ADMIN_USERNAME')
  const adminPassword = required('ADMIN_PASSWORD')
  const ftUsername = required('FITTRACK_USERNAME')
  const ftPassword = required('FITTRACK_PASSWORD')

  const migrationPath = resolve(
    process.cwd(),
    'supabase/migrations/20260418_create_auth_users.sql'
  )
  const migrationSql = readFileSync(migrationPath, 'utf8')

  const connectionString = buildConnectionString()
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } })
  await client.connect()

  try {
    console.log('Applying auth_users migration...')
    await client.query(migrationSql)

    console.log('Hashing credentials...')
    const adminHash = await bcrypt.hash(adminPassword, 10)
    const ftHash = await bcrypt.hash(ftPassword, 10)

    console.log('Upserting admin user...')
    await client.query(
      `INSERT INTO auth_users (username, password_hash, role)
       VALUES ($1, $2, 'admin')
       ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role`,
      [adminUsername, adminHash]
    )

    console.log('Upserting fittrack user...')
    await client.query(
      `INSERT INTO auth_users (username, password_hash, role)
       VALUES ($1, $2, 'fittrack')
       ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role`,
      [ftUsername, ftHash]
    )

    const { rows } = await client.query(
      'SELECT username, role FROM auth_users ORDER BY role'
    )
    console.log('Seeded auth_users:')
    for (const r of rows) {
      console.log(`  - ${r.role}: ${r.username}`)
    }
  } finally {
    await client.end()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

import { config } from 'dotenv'
import { resolve } from 'path'
import { readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'

config({ path: resolve(process.cwd(), '.env.local') })

const url = process.env.NEXT_PUBLIC_FITTRACK_SUPABASE_URL || ''
const key = process.env.NEXT_PUBLIC_FITTRACK_SUPABASE_KEY || ''

if (!url || !key) {
  console.error('NEXT_PUBLIC_FITTRACK_SUPABASE_URL and NEXT_PUBLIC_FITTRACK_SUPABASE_KEY must be set in .env.local')
  process.exit(1)
}

const db = createClient(url, key, { auth: { persistSession: false } })

const SNAPSHOT = resolve(process.cwd(), 'data/ifct2017/compositions-v2.0.9.csv')

type Row = Record<string, string>

function parseCsv(text: string): Row[] {
  const rows: string[][] = []
  let i = 0
  let cell = ''
  let row: string[] = []
  let inQuotes = false
  while (i < text.length) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          cell += '"'
          i += 2
          continue
        }
        inQuotes = false
        i++
        continue
      }
      cell += c
      i++
      continue
    }
    if (c === '"') {
      inQuotes = true
      i++
      continue
    }
    if (c === ',') {
      row.push(cell)
      cell = ''
      i++
      continue
    }
    if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++
      row.push(cell)
      cell = ''
      rows.push(row)
      row = []
      i++
      continue
    }
    cell += c
    i++
  }
  if (cell.length > 0 || row.length > 0) {
    row.push(cell)
    rows.push(row)
  }

  if (rows.length === 0) return []
  const header = rows[0]
  const colKeys = header.map((h) => {
    const m = h.match(/;\s*([a-zA-Z0-9_]+)$/)
    return m ? m[1] : h.trim()
  })
  const out: Row[] = []
  for (let r = 1; r < rows.length; r++) {
    const r0 = rows[r]
    if (r0.length === 1 && r0[0] === '') continue
    const obj: Row = {}
    for (let c = 0; c < colKeys.length; c++) {
      obj[colKeys[c]] = r0[c] ?? ''
    }
    out.push(obj)
  }
  return out
}

const GROUP_TO_CATEGORY: Record<string, string> = {
  'Cereals and Millets': 'carbs',
  'Grain Legumes': 'protein',
  'Green Leafy Vegetables': 'vegetable',
  'Other Vegetables': 'vegetable',
  'Fruits': 'fruit',
  'Roots and Tubers': 'carbs',
  'Condiments and Spices': 'other',
  'Nuts and Oil Seeds': 'fat',
  'Sugars': 'other',
  'Mushrooms': 'vegetable',
  'Milk and Milk Products': 'dairy',
  'Egg and Egg Products': 'protein',
  'Poultry': 'protein',
  'Animal Meat': 'protein',
  'Marine Fish': 'protein',
  'Marine Shellfish': 'protein',
  'Marine Mollusks': 'protein',
  'Fresh Water Fish and Shellfish': 'protein',
  'Edible Oils and Fats': 'fat',
  'Miscellaneous Foods': 'other',
}

function num(v: string | undefined): number {
  if (!v) return 0
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

function round1(n: number): number {
  return Math.round(n * 10) / 10
}

function normalizeName(s: string): string {
  return s.trim().replace(/\s+/g, ' ')
}

type FoodRow = {
  name: string
  serving_size_g: number
  serving_unit: string
  protein_g: number
  calories: number
  carbs_g: number
  fat_g: number
  category: string
  notes: string
}

async function main() {
  console.log(`Reading snapshot: ${SNAPSHOT}`)
  const text = readFileSync(SNAPSHOT, 'utf8')
  const rows = parseCsv(text)
  console.log(`Parsed ${rows.length} rows from IFCT 2017.`)

  const { data: existing, error: e1 } = await db
    .from('food_library')
    .select('name')
  if (e1) throw e1
  const existingSet = new Set((existing ?? []).map((r: { name: string }) => r.name.trim().toLowerCase()))
  console.log(`Existing rows: ${existingSet.size}`)

  const candidates: FoodRow[] = []
  const skippedNoMacros: string[] = []
  const skippedDuplicate: string[] = []
  for (const r of rows) {
    const rawName = r.name
    if (!rawName) continue
    const name = normalizeName(rawName)
    const key = name.toLowerCase()
    if (existingSet.has(key)) {
      skippedDuplicate.push(name)
      continue
    }
    const enerc_kj = num(r.enerc)
    const calories = Math.round(enerc_kj / 4.184)
    const protein_g = round1(num(r.protcnt))
    const carbs_g = round1(num(r.choavldf))
    const fat_g = round1(num(r.fatce))
    if (calories === 0 && protein_g === 0 && carbs_g === 0 && fat_g === 0) {
      skippedNoMacros.push(name)
      continue
    }
    const category = GROUP_TO_CATEGORY[r.grup] ?? 'other'
    candidates.push({
      name,
      serving_size_g: 100,
      serving_unit: 'g',
      protein_g,
      calories,
      carbs_g,
      fat_g,
      category,
      notes: `IFCT 2017 (${r.code})`,
    })
    existingSet.add(key)
  }

  console.log(`To insert: ${candidates.length}`)
  console.log(`Skipped (duplicate name): ${skippedDuplicate.length}`)
  console.log(`Skipped (zero macros): ${skippedNoMacros.length}`)

  if (candidates.length === 0) {
    console.log('Nothing to insert.')
    return
  }

  const dry = process.argv.includes('--dry-run')
  if (dry) {
    console.log('DRY RUN: first 5 candidates:')
    for (const c of candidates.slice(0, 5)) console.log(`  ${c.category}  ${c.name}  ${c.calories}cal`)
    return
  }

  const BATCH = 100
  let inserted = 0
  for (let i = 0; i < candidates.length; i += BATCH) {
    const chunk = candidates.slice(i, i + BATCH)
    const { error } = await db
      .from('food_library')
      .upsert(chunk, { onConflict: 'name', ignoreDuplicates: true })
    if (error) {
      console.error(`Batch ${i} failed:`, error.message)
      throw error
    }
    inserted += chunk.length
    console.log(`Inserted ${inserted}/${candidates.length}`)
  }
  console.log('Done.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

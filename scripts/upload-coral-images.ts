import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Load .env.local
config({ path: path.join(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing')
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'Set' : 'Missing')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const images = [
  '275594981_641387613759403_4598945770693618534_n.webp.jpg',
  '275828749_227700996211204_8693221892605276577_n.webp.jpg',
  'IMG20231127131252 Copy.JPG',
]

async function uploadImage(fileName: string): Promise<string | null> {
  const filePath = path.join(process.cwd(), 'public', fileName)
  
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`)
    return null
  }

  const fileBuffer = fs.readFileSync(filePath)
  const fileExt = path.extname(fileName).toLowerCase()
  const sanitizedName = fileName.replace(/\s+/g, '_')
  const uploadPath = `hero-corals/${sanitizedName}`

  console.log(`Uploading ${fileName} to ${uploadPath}...`)

  const { data, error } = await supabase.storage
    .from('site-images')
    .upload(uploadPath, fileBuffer, {
      contentType: fileExt === '.jpg' || fileExt === '.jpeg' ? 'image/jpeg' : 'image/png',
      upsert: true,
    })

  if (error) {
    console.error(`Error uploading ${fileName}:`, error)
    return null
  }

  const { data: publicUrlData } = supabase.storage
    .from('site-images')
    .getPublicUrl(uploadPath)

  console.log(`✅ Uploaded: ${publicUrlData.publicUrl}`)
  return publicUrlData.publicUrl
}

async function main() {
  console.log('Starting coral image upload to Supabase...\n')

  const uploadedUrls: string[] = []

  for (const image of images) {
    const url = await uploadImage(image)
    if (url) {
      uploadedUrls.push(url)
    }
  }

  console.log('\n✅ All images uploaded!')
  console.log('\nURLs:')
  uploadedUrls.forEach((url, index) => {
    console.log(`Image ${index + 1}: ${url}`)
  })

  console.log('\nAdd these to your home.json or admin panel hero settings.')
}

main()


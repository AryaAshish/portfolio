import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials in .env.local')
}

const supabase = createClient(supabaseUrl, supabaseKey)

const localImages = [
  { 
    localPath: 'public/275594981_641387613759403_4598945770693618534_n.webp.jpg',
    name: 'hero-image-1.jpg'
  },
  { 
    localPath: 'public/275828749_227700996211204_8693221892605276577_n.webp.jpg',
    name: 'hero-image-2.jpg'
  },
  { 
    localPath: 'public/IMG20231127131252 Copy.JPG',
    name: 'hero-image-3.jpg'
  },
]

async function uploadImageToSupabase(localPath: string, fileName: string): Promise<string | null> {
  try {
    const fullPath = path.join(process.cwd(), localPath)
    
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ File not found: ${fullPath}`)
      return null
    }

    const fileBuffer = fs.readFileSync(fullPath)
    const filePath = `hero/${fileName}`

    console.log(`📤 Uploading ${fileName}...`)

    const { data, error } = await supabase.storage
      .from('site-images')
      .upload(filePath, fileBuffer, {
        contentType: 'image/jpeg',
        upsert: true,
      })

    if (error) {
      console.error(`❌ Error uploading ${fileName}:`, error.message)
      return null
    }

    const { data: urlData } = supabase.storage
      .from('site-images')
      .getPublicUrl(filePath)

    console.log(`✅ Uploaded ${fileName}: ${urlData.publicUrl}`)
    return urlData.publicUrl
  } catch (error: any) {
    console.error(`❌ Error processing ${fileName}:`, error.message)
    return null
  }
}

async function updateHomeContent(images: Array<{ url: string; cropX: number; cropY: number }>) {
  try {
    const { data: existingContent, error: fetchError } = await supabase
      .from('content_pages')
      .select('content')
      .eq('page_type', 'home')
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError
    }

    const currentContent = existingContent?.content || {}
    
    const updatedContent = {
      ...currentContent,
      hero: {
        ...currentContent.hero,
        coralImages: images,
      },
    }

    const { error: updateError } = await supabase
      .from('content_pages')
      .upsert({
        page_type: 'home',
        content: updatedContent,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'page_type'
      })

    if (updateError) {
      throw updateError
    }

    console.log('✅ Updated home content in Supabase')
    return true
  } catch (error: any) {
    console.error('❌ Error updating home content:', error.message)
    return false
  }
}

async function migrateHeroImages() {
  console.log('\n🚀 Starting migration of hero images to Supabase...\n')

  const uploadedImages: Array<{ url: string; cropX: number; cropY: number }> = []

  for (const image of localImages) {
    const url = await uploadImageToSupabase(image.localPath, image.name)
    if (url) {
      uploadedImages.push({
        url,
        cropX: 50,
        cropY: 50,
      })
    }
  }

  if (uploadedImages.length > 0) {
    console.log(`\n📝 Updating home content with ${uploadedImages.length} images...`)
    const success = await updateHomeContent(uploadedImages)
    
    if (success) {
      console.log('\n✅ Migration complete!')
      console.log('\n📋 Next steps:')
      console.log('   1. Verify images in admin panel: /admin/content/home')
      console.log('   2. You can now delete local images from public/ folder if desired')
      console.log('   3. All future images will be uploaded directly to Supabase')
    } else {
      console.log('\n⚠️  Images uploaded but failed to update content. Please update manually in admin panel.')
    }
  } else {
    console.log('\n❌ No images were uploaded. Please check the errors above.')
  }
}

migrateHeroImages().catch(console.error)


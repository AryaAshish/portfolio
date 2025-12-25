import { config } from 'dotenv'
import { resolve } from 'path'
import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

// Load .env.local FIRST, before any other imports
config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Supabase credentials not found in .env.local')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function uploadHeroVideo() {
  if (!supabaseAdmin) {
    console.error('Supabase admin client not configured')
    return
  }

  const videoPath = path.join(process.cwd(), 'vecteezy_underwater-scene-multiple-clownfish-swimming-in-anemone_33344055.mov')
  
  if (!fs.existsSync(videoPath)) {
    console.error('Video file not found:', videoPath)
    return
  }

  console.log('Uploading hero video to Supabase...')

  try {
    const videoBuffer = fs.readFileSync(videoPath)
    const fileName = 'hero-background.mov'
    const filePath = `videos/${fileName}`

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from('videos')
      .upload(filePath, videoBuffer, {
        contentType: 'video/quicktime',
        upsert: true, // Replace if exists
      })

    if (error) {
      console.error('Upload error:', error)
      return
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('videos')
      .getPublicUrl(filePath)

    console.log('✅ Video uploaded successfully!')
    console.log('Public URL:', urlData.publicUrl)
    console.log('\nAdd this URL to your home.json hero.videoUrl field or use the admin panel.')
  } catch (error) {
    console.error('Error uploading video:', error)
  }
}

uploadHeroVideo()


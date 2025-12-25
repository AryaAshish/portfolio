import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { config } from 'dotenv'
import { resolve } from 'path'

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

async function uploadResume() {
  if (!supabaseAdmin) {
    console.error('Supabase admin client not configured')
    return
  }

  const resumePath = path.join(process.cwd(), 'Ashish_Aryan_Android_4.6.pdf')
  
  if (!fs.existsSync(resumePath)) {
    console.error('Resume file not found:', resumePath)
    return
  }

  console.log('Uploading resume to Supabase...')

  try {
    const resumeBuffer = fs.readFileSync(resumePath)
    const fileName = 'Ashish_Aryan_Resume.pdf'
    // Upload directly to bucket root (no subfolder)
    const filePath = fileName

    // Delete existing file if it exists
    await supabaseAdmin.storage
      .from('resumes')
      .remove([fileName, `resumes/${fileName}`])

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from('resumes')
      .upload(filePath, resumeBuffer, {
        contentType: 'application/pdf',
        upsert: true, // Replace if exists
      })

    if (error) {
      console.error('Upload error:', error)
      return
    }

    // Get public URL - use just the filename, not the path
    const { data: urlData } = supabaseAdmin.storage
      .from('resumes')
      .getPublicUrl(fileName)

    console.log('✅ Resume uploaded successfully!')
    console.log('Public URL:', urlData.publicUrl)
    console.log('\nThe resume is now available for download.')
    console.log('You can update the hire page content in the admin panel to use this URL.')
  } catch (error) {
    console.error('Error uploading resume:', error)
  }
}

uploadResume()


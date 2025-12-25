import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, message: 'Supabase not configured' }, { status: 500 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const bucket = formData.get('bucket') as string || 'blog-images'

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file provided' }, { status: 400 })
    }

    // Validate file type based on bucket
    const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    const videoTypes = ['video/mp4', 'video/mov', 'video/webm', 'video/quicktime', 'video/x-msvideo']
    const pdfTypes = ['application/pdf']
    
    let allowedTypes: string[] = []
    let maxSize = 0
    
    if (bucket === 'videos') {
      allowedTypes = videoTypes
      maxSize = 100 * 1024 * 1024 // 100MB for videos
    } else if (bucket === 'resumes') {
      allowedTypes = pdfTypes
      maxSize = 10 * 1024 * 1024 // 10MB for resumes
    } else if (bucket === 'blog-images') {
      allowedTypes = imageTypes
      maxSize = 5 * 1024 * 1024 // 5MB for blog images
    } else if (bucket === 'site-images') {
      allowedTypes = imageTypes
      maxSize = 10 * 1024 * 1024 // 10MB for site images
    } else {
      allowedTypes = imageTypes
      maxSize = 10 * 1024 * 1024
    }
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ success: false, message: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}` }, { status: 400 })
    }
    
    if (file.size > maxSize) {
      return NextResponse.json({ success: false, message: `File too large. Max size: ${maxSize / 1024 / 1024}MB` }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExt = file.name.split('.').pop()
    const fileName = `${timestamp}-${randomString}.${fileExt}`
    const filePath = `${bucket}/${fileName}`

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      console.error('Supabase upload error:', error)
      
      // Provide helpful error message for file size issues
      if (error.message?.includes('exceeded') || error.message?.includes('413')) {
        return NextResponse.json({ 
          success: false, 
          message: 'File too large for direct upload. Supabase free plan has a 50MB limit. Please upload via Supabase Dashboard or use the manual URL option.' 
        }, { status: 413 })
      }
      
      return NextResponse.json({ success: false, message: error.message || 'Upload failed' }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(filePath)

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      path: filePath,
      fileName: fileName,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, message: 'Supabase not configured' }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const path = searchParams.get('path')
    const bucket = searchParams.get('bucket') || 'blog-images'

    if (!path) {
      return NextResponse.json({ success: false, message: 'Path is required' }, { status: 400 })
    }

    const { error } = await supabaseAdmin.storage
      .from(bucket)
      .remove([path])

    if (error) {
      console.error('Supabase delete error:', error)
      return NextResponse.json({ success: false, message: error.message || 'Delete failed' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}

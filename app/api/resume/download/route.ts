import { NextRequest, NextResponse } from 'next/server'
import { getHireContent } from '@/lib/hire'

export async function GET(request: NextRequest) {
  try {
    const hireContent = await getHireContent()
    const resumeUrl = hireContent.resumeUrl || "https://sxyfqzblgpqjhqxcomau.supabase.co/storage/v1/object/public/resumes/Ashish_Aryan_Resume.pdf"

    if (!resumeUrl || resumeUrl === "/resume.pdf") {
      // Fallback to Supabase URL if not configured
      const defaultUrl = "https://sxyfqzblgpqjhqxcomau.supabase.co/storage/v1/object/public/resumes/Ashish_Aryan_Resume.pdf"
      
      const response = await fetch(defaultUrl, {
        headers: {
          'Accept': 'application/pdf',
        },
      })

      if (!response.ok) {
        return NextResponse.json(
          { error: 'Failed to fetch resume from Supabase' },
          { status: response.status }
        )
      }

      const pdfBuffer = await response.arrayBuffer()

      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="Ashish_Aryan_Resume.pdf"',
          'Content-Length': pdfBuffer.byteLength.toString(),
          'Cache-Control': 'public, max-age=3600',
        },
      })
    }

    // Fetch the PDF from the configured URL
    const response = await fetch(resumeUrl, {
      headers: {
        'Accept': 'application/pdf',
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch resume', details: response.statusText },
        { status: response.status }
      )
    }

    const pdfBuffer = await response.arrayBuffer()

    // Return the PDF with proper headers to force download
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Ashish_Aryan_Resume.pdf"',
        'Content-Length': pdfBuffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error: any) {
    console.error('Error downloading resume:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}


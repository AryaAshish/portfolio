'use client'

import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'

interface VideoUploadProps {
  bucket?: 'videos'
  onUploadComplete?: (url: string, path: string) => void
  onDelete?: (path: string) => void
  existingVideo?: string
  label?: string
  className?: string
}

export function VideoUpload({
  bucket = 'videos',
  onUploadComplete,
  onDelete,
  existingVideo,
  label = 'Upload Video',
  className = '',
}: VideoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(existingVideo || null)
  const [uploadedPath, setUploadedPath] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(existingVideo || null)
  const [manualUrl, setManualUrl] = useState('')
  const [showManualInput, setShowManualInput] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('video/')) {
      setError('Please select a video file')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Check file size - use resumable upload for files > 50MB
    const useResumableUpload = file.size > 50 * 1024 * 1024

    if (useResumableUpload && !supabase) {
      setError('Large file upload requires Supabase client. Please use manual URL option or upload via Supabase dashboard.')
      setShowManualInput(true)
      setUploading(false)
      return
    }

    // Upload file
    setUploading(true)
    setError(null)
    setUploadProgress(0)

    try {
      if (useResumableUpload && supabase) {
        // Use resumable upload for large files
        const fileName = `videos/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type,
          })

        if (uploadError) {
          // If upload fails due to size, suggest manual upload
          if (uploadError.message.includes('exceeded') || uploadError.message.includes('413')) {
            setError('File too large for direct upload. Please upload via Supabase Dashboard or use the manual URL option below.')
            setShowManualInput(true)
            setUploading(false)
            return
          }
          throw uploadError
        }

        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(fileName)

        setUploadedUrl(urlData.publicUrl)
        setUploadedPath(fileName)
        if (onUploadComplete) {
          onUploadComplete(urlData.publicUrl, fileName)
        }
      } else {
        // Use standard upload for smaller files
        const formData = new FormData()
        formData.append('file', file)
        formData.append('bucket', bucket)

        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        })

        const data = await response.json()

        if (!data.success) {
          // If upload fails due to size, suggest manual upload
          if (data.message?.includes('exceeded') || data.message?.includes('413')) {
            setError('File too large for direct upload. Please upload via Supabase Dashboard or use the manual URL option below.')
            setShowManualInput(true)
            setUploading(false)
            return
          }
          throw new Error(data.message || 'Upload failed')
        }

        setUploadedUrl(data.url)
        setUploadedPath(data.path)
        if (onUploadComplete) {
          onUploadComplete(data.url, data.path)
        }
      }
    } catch (err: any) {
      setError(err.message || 'Upload failed')
      if (err.message?.includes('exceeded') || err.message?.includes('413')) {
        setShowManualInput(true)
      }
      setPreview(null)
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleDelete = async () => {
    if (!uploadedPath) return

    try {
      const response = await fetch(`/api/admin/upload?path=${encodeURIComponent(uploadedPath)}&bucket=${bucket}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || 'Delete failed')
      }

      setUploadedUrl(null)
      setUploadedPath(null)
      setPreview(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      if (onDelete) {
        onDelete(uploadedPath)
      }
    } catch (err: any) {
      setError(err.message || 'Delete failed')
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {label && <label className="block text-sm font-medium text-ocean-deep">{label}</label>}

      {preview ? (
        <div className="relative group">
          <div className="relative w-full h-64 bg-ocean-pale/10 rounded-lg overflow-hidden border border-ocean-light/20">
            <video
              src={preview}
              className="w-full h-full object-contain"
              controls
              muted
            />
          </div>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => {
                setPreview(null)
                setUploadedUrl(null)
                setUploadedPath(null)
                if (fileInputRef.current) {
                  fileInputRef.current.value = ''
                }
              }}
              className="px-4 py-2 bg-ocean-light text-ocean-deep rounded-lg text-sm font-medium hover:bg-ocean-base transition-colors"
              disabled={uploading}
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
              disabled={uploading}
            >
              Delete
            </button>
          </div>
          {uploadedUrl && (
            <div className="mt-2 p-2 bg-ocean-pale/10 rounded text-xs text-ocean-base break-all">
              <strong>URL:</strong> {uploadedUrl}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-ocean-light rounded-lg p-8 text-center cursor-pointer hover:border-teal-base transition-colors"
          >
            <div className="text-ocean-base mb-2">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-ocean-base font-medium">{uploading ? 'Uploading...' : 'Click to upload video'}</p>
            <p className="text-ocean-light text-sm mt-1">MP4, MOV, WEBM (files &gt;50MB: use manual URL below)</p>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-ocean-light/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-neutral-white text-ocean-light">OR</span>
            </div>
          </div>

          <div className="p-4 bg-ocean-pale/10 rounded-lg border border-ocean-light/30">
            <label className="block text-sm font-medium text-ocean-deep mb-2">
              Paste video URL directly
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={manualUrl}
                onChange={(e) => setManualUrl(e.target.value)}
                placeholder="https://your-project.supabase.co/storage/v1/object/public/videos/..."
                className="flex-1 px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base text-sm"
              />
              <button
                type="button"
                onClick={() => {
                  if (manualUrl) {
                    setUploadedUrl(manualUrl)
                    setPreview(manualUrl)
                    if (onUploadComplete) {
                      onUploadComplete(manualUrl, '')
                    }
                    setManualUrl('')
                  }
                }}
                className="px-4 py-2 bg-teal-base text-neutral-white rounded-lg text-sm font-medium hover:bg-teal-dark transition-colors whitespace-nowrap"
              >
                Use URL
              </button>
            </div>
            <p className="text-xs text-ocean-light mt-2">
              For large files (&gt;50MB): Upload via{' '}
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-base hover:underline"
              >
                Supabase Dashboard
              </a>
              {' '}→ Storage → videos bucket, then paste the public URL here
            </p>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}


      {uploading && (
        <div className="mt-2">
          <div className="w-full bg-ocean-pale/20 rounded-full h-2">
            <div
              className="bg-teal-base h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-xs text-ocean-light mt-1 text-center">
            {uploadProgress > 0 ? `Uploading... ${uploadProgress}%` : 'Preparing upload...'}
          </p>
        </div>
      )}
    </div>
  )
}


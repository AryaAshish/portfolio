'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

interface ImageUploadProps {
  bucket?: 'blog-images' | 'site-images'
  onUploadComplete?: (url: string, path: string) => void
  onDelete?: (path: string) => void
  existingImage?: string
  label?: string
  className?: string
}

export function ImageUpload({
  bucket = 'blog-images',
  onUploadComplete,
  onDelete,
  existingImage,
  label = 'Upload Image',
  className = '',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(existingImage || null)
  const [uploadedPath, setUploadedPath] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(existingImage || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload file
    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('bucket', bucket)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || 'Upload failed')
      }

      setUploadedUrl(data.url)
      setUploadedPath(data.path)
      if (onUploadComplete) {
        onUploadComplete(data.url, data.path)
      }
    } catch (err: any) {
      setError(err.message || 'Upload failed')
      setPreview(null)
    } finally {
      setUploading(false)
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
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-contain"
              unoptimized={preview.startsWith('data:') || preview.includes('supabase.co')}
            />
          </div>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-ocean-light text-ocean-deep rounded-lg text-sm font-medium hover:bg-ocean-base transition-colors"
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Replace'}
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
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-ocean-light rounded-lg p-8 text-center cursor-pointer hover:border-teal-base transition-colors"
        >
          <div className="text-ocean-base mb-2">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-ocean-base font-medium">{uploading ? 'Uploading...' : 'Click to upload image'}</p>
          <p className="text-ocean-light text-sm mt-1">PNG, JPG, GIF, WEBP up to {bucket === 'blog-images' ? '5MB' : '10MB'}</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
    </div>
  )
}


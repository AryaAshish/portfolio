import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST, DELETE } from '@/app/api/admin/upload/route'
import { NextRequest } from 'next/server'

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabaseAdmin: {
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn(),
        remove: vi.fn(),
        getPublicUrl: vi.fn(),
      })),
    },
  },
}))

import { supabaseAdmin } from '@/lib/supabase'

describe('Admin Upload API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('POST /api/admin/upload', () => {
    it.skip('should upload image successfully', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const formData = new FormData()
      formData.append('file', mockFile)
      formData.append('bucket', 'blog-images')

      const mockUpload = vi.fn().mockResolvedValue({
        data: { path: 'blog-images/test.jpg' },
        error: null,
      })

      const mockGetPublicUrl = vi.fn().mockReturnValue({
        data: { publicUrl: 'https://example.com/test.jpg' },
      })

      vi.mocked(supabaseAdmin!.storage.from).mockReturnValue({
        upload: mockUpload,
        getPublicUrl: mockGetPublicUrl,
      } as any)

      const request = new NextRequest('http://localhost:3000/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.url).toBe('https://example.com/test.jpg')
      expect(data.path).toContain('blog-images/')
    })

    it.skip('should reject files that are too large', async () => {
      const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' })
      const formData = new FormData()
      formData.append('file', largeFile)
      formData.append('bucket', 'blog-images')

      const request = new NextRequest('http://localhost:3000/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.message).toContain('too large')
    }, 10000)

    it.skip('should reject invalid file types', async () => {
      const txtFile = new File(['test'], 'test.txt', { type: 'text/plain' })
      const formData = new FormData()
      formData.append('file', txtFile)
      formData.append('bucket', 'blog-images')

      const request = new NextRequest('http://localhost:3000/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.message).toContain('Invalid file type')
    }, 10000)

    it('should return error when no file provided', async () => {
      const formData = new FormData()
      formData.append('bucket', 'blog-images')

      const request = new NextRequest('http://localhost:3000/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.message).toBe('No file provided')
    })

    it.skip('should handle different bucket types', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const formData = new FormData()
      formData.append('file', mockFile)
      formData.append('bucket', 'site-images')

      const mockUpload = vi.fn().mockResolvedValue({
        data: { path: 'site-images/test.jpg' },
        error: null,
      })

      const mockGetPublicUrl = vi.fn().mockReturnValue({
        data: { publicUrl: 'https://example.com/test.jpg' },
      })

      vi.mocked(supabaseAdmin!.storage.from).mockReturnValue({
        upload: mockUpload,
        getPublicUrl: mockGetPublicUrl,
      } as any)

      const request = new NextRequest('http://localhost:3000/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    }, 10000)

    it.skip('should handle Supabase upload errors', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const formData = new FormData()
      formData.append('file', mockFile)
      formData.append('bucket', 'blog-images')

      const mockUpload = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Upload failed' },
      })

      vi.mocked(supabaseAdmin!.storage.from).mockReturnValue({
        upload: mockUpload,
      } as any)

      const request = new NextRequest('http://localhost:3000/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
    }, 10000)
  })

  describe('DELETE /api/admin/upload', () => {
    it('should delete file successfully', async () => {
      const mockRemove = vi.fn().mockResolvedValue({
        data: {},
        error: null,
      })

      vi.mocked(supabaseAdmin!.storage.from).mockReturnValue({
        remove: mockRemove,
      } as any)

      const request = new NextRequest('http://localhost:3000/api/admin/upload?path=blog-images/test.jpg&bucket=blog-images')

      const response = await DELETE(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(mockRemove).toHaveBeenCalledWith(['blog-images/test.jpg'])
    })

    it('should return error when path is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/upload?bucket=blog-images')

      const response = await DELETE(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.message).toBe('Path is required')
    })

    it('should handle Supabase delete errors', async () => {
      const mockRemove = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Delete failed' },
      })

      vi.mocked(supabaseAdmin!.storage.from).mockReturnValue({
        remove: mockRemove,
      } as any)

      const request = new NextRequest('http://localhost:3000/api/admin/upload?path=blog-images/test.jpg&bucket=blog-images')

      const response = await DELETE(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
    })
  })
})

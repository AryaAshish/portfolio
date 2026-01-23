import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, PUT } from '@/app/api/admin/content/home/route'
import { NextRequest } from 'next/server'

// Mock db module
vi.mock('@/lib/db', () => ({
  db: {
    content: {
      get: vi.fn(),
      set: vi.fn(),
    },
  },
}))

import { db } from '@/lib/db'

describe('Admin Home Content API', () => {
  const mockHomeContent = {
    hero: {
      title: 'Test Title',
      subtitle: 'Test Subtitle',
      backgroundImageUrl: 'https://example.com/image.jpg',
      coralImages: [
        { url: 'https://example.com/coral1.jpg', cropX: 50, cropY: 50 },
        { url: 'https://example.com/coral2.jpg', cropX: 50, cropY: 40 },
      ],
      cta: {
        primary: { text: 'Primary', href: '/primary' },
        secondary: { text: 'Secondary', href: '/secondary' },
        tertiary: { text: 'Tertiary', href: '/tertiary' },
      },
    },
    whatImGoodAt: {
      title: 'What I\'m Good At',
      items: [],
    },
    whatIDontOptimizeFor: {
      title: 'What I Don\'t Optimize For',
      items: [],
    },
    hiring: {
      title: 'Open to Opportunities',
      roles: ['Senior Engineer', 'Tech Lead'],
      teams: ['Product', 'Platform'],
      cta: {
        primary: { text: 'Hire Me', href: '/hire' },
        secondary: { text: 'View Resume', href: '/resume' },
      },
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/admin/content/home', () => {
    it('should return home content from Supabase', async () => {
      vi.mocked(db.content.get).mockResolvedValue(mockHomeContent)

      const request = new NextRequest('http://localhost:3000/api/admin/content/home')
      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.content).toEqual(mockHomeContent)
      expect(db.content.get).toHaveBeenCalledWith('home')
    })

    it('should return null when content not found', async () => {
      vi.mocked(db.content.get).mockResolvedValue(null)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.content).toBeNull()
    })

    it('should handle database errors', async () => {
      vi.mocked(db.content.get).mockRejectedValue(new Error('Database error'))

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
    })
  })

  describe('PUT /api/admin/content/home', () => {
    it('should update home content successfully', async () => {
      vi.mocked(db.content.set).mockResolvedValue(undefined)

      const request = new NextRequest('http://localhost:3000/api/admin/content/home', {
        method: 'PUT',
        body: JSON.stringify({ content: mockHomeContent }),
      })

      const response = await PUT(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(db.content.set).toHaveBeenCalledWith('home', mockHomeContent)
    })

    it('should return error when content is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/content/home', {
        method: 'PUT',
        body: JSON.stringify({}),
      })

      const response = await PUT(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.message).toBe('Invalid content')
    })

    it('should handle database update errors', async () => {
      vi.mocked(db.content.set).mockRejectedValue(new Error('Update failed'))

      const request = new NextRequest('http://localhost:3000/api/admin/content/home', {
        method: 'PUT',
        body: JSON.stringify({ content: mockHomeContent }),
      })

      const response = await PUT(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
    })

    it('should validate coral images structure', async () => {
      const invalidContent = {
        ...mockHomeContent,
        hero: {
          ...mockHomeContent.hero,
          coralImages: [
            { url: 'https://example.com/coral1.jpg', cropX: 50, cropY: 50 },
            { url: 'https://example.com/coral2.jpg', cropX: 50, cropY: 40 },
            { url: 'https://example.com/coral3.jpg', cropX: 50, cropY: 60 },
          ],
        },
      }

      vi.mocked(db.content.set).mockResolvedValue(undefined)

      const request = new NextRequest('http://localhost:3000/api/admin/content/home', {
        method: 'PUT',
        body: JSON.stringify({ content: invalidContent }),
      })

      const response = await PUT(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })
  })
})

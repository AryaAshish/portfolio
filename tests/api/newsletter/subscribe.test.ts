import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/newsletter/subscribe/route'
import { NextRequest } from 'next/server'

vi.mock('@/lib/db', () => ({
  db: {
    subscribers: {
      create: vi.fn(),
    },
  },
}))

vi.mock('@/lib/newsletter', () => ({
  getNewsletterProvider: vi.fn(() => ({
    subscribe: vi.fn(),
  })),
}))

import { db } from '@/lib/db'
import { getNewsletterProvider } from '@/lib/newsletter'

describe('Newsletter Subscribe API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('POST /api/newsletter/subscribe', () => {
    it('should subscribe email successfully', async () => {
      const mockProvider = {
        subscribe: vi.fn().mockResolvedValue({ success: true }),
      }
      vi.mocked(getNewsletterProvider).mockReturnValue(mockProvider as any)
      vi.mocked(db.subscribers.create).mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        subscribed_at: new Date().toISOString(),
        active: true,
      } as any)

      const request = new NextRequest('http://localhost:3000/api/newsletter/subscribe', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com' }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    it('should reject missing email', async () => {
      const request = new NextRequest('http://localhost:3000/api/newsletter/subscribe', {
        method: 'POST',
        body: JSON.stringify({}),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.message).toContain('Email is required')
    })

    it('should reject invalid email type', async () => {
      const request = new NextRequest('http://localhost:3000/api/newsletter/subscribe', {
        method: 'POST',
        body: JSON.stringify({ email: 123 }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.message).toContain('Email is required')
    })

    it('should handle provider errors', async () => {
      const mockProvider = {
        subscribe: vi.fn().mockResolvedValue({ 
          success: false, 
          message: 'Provider error' 
        }),
      }
      vi.mocked(getNewsletterProvider).mockReturnValue(mockProvider as any)
      vi.mocked(db.subscribers.create).mockResolvedValue({} as any)

      const request = new NextRequest('http://localhost:3000/api/newsletter/subscribe', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com' }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
    })

    it('should handle unexpected errors', async () => {
      const mockProvider = {
        subscribe: vi.fn().mockRejectedValue(new Error('Unexpected error')),
      }
      vi.mocked(getNewsletterProvider).mockReturnValue(mockProvider as any)

      const request = new NextRequest('http://localhost:3000/api/newsletter/subscribe', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com' }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.message).toBe('Internal server error')
    })
  })
})

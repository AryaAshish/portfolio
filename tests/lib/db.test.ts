import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Supabase before importing db
vi.mock('@/lib/supabase', () => ({
  supabaseAdmin: {
    from: vi.fn(),
    storage: {
      from: vi.fn(),
    },
  },
  supabase: null,
}))

import { db } from '@/lib/db'
import { supabaseAdmin } from '@/lib/supabase'

describe('Database Operations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Blog Operations', () => {
    it('should fetch all blog posts', async () => {
      const mockPosts = [
        {
          slug: 'test-post',
          title: 'Test Post',
          description: 'Test description',
          content: 'Test content',
          tags: ['test'],
          category: 'tech',
          published: true,
          published_at: new Date().toISOString(),
        },
      ]

      const mockSelect = vi.fn().mockReturnThis()
      const mockOrder = vi.fn().mockResolvedValue({ data: mockPosts, error: null })

      vi.mocked(supabaseAdmin!.from).mockReturnValue({
        select: mockSelect,
        order: mockOrder,
      } as any)

      const posts = await db.blog.getAll()

      expect(posts).toHaveLength(1)
      expect(posts[0].slug).toBe('test-post')
      expect(supabaseAdmin!.from).toHaveBeenCalledWith('blog_posts')
    })

    it('should fetch blog post by slug', async () => {
      const mockPost = {
        slug: 'test-post',
        title: 'Test Post',
        description: 'Test description',
        content: 'Test content',
        tags: ['test'],
        category: 'tech',
        published: true,
        published_at: new Date().toISOString(),
      }

      const mockSelect = vi.fn().mockReturnThis()
      const mockEq = vi.fn().mockReturnThis()
      const mockSingle = vi.fn().mockResolvedValue({ data: mockPost, error: null })

      vi.mocked(supabaseAdmin!.from).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      } as any)

      const post = await db.blog.getBySlug('test-post')

      expect(post).not.toBeNull()
      expect(post?.slug).toBe('test-post')
    })

    it('should create a new blog post', async () => {
      const newPost = {
        slug: 'new-post',
        title: 'New Post',
        description: 'New description',
        content: 'New content',
        tags: ['new'],
        category: 'tech' as const,
        published: true,
        date: new Date().toISOString(),
        publishedAt: new Date().toISOString(),
      }

      const mockInsert = vi.fn().mockReturnThis()
      const mockSelect = vi.fn().mockReturnThis()
      const mockSingle = vi.fn().mockResolvedValue({ data: newPost, error: null })

      vi.mocked(supabaseAdmin!.from).mockReturnValue({
        insert: mockInsert,
        select: mockSelect,
        single: mockSingle,
      } as any)

      const result = await db.blog.create(newPost)

      expect(result.slug).toBe('new-post')
      expect(mockInsert).toHaveBeenCalled()
    })

    it('should update existing blog post', async () => {
      const mockUpdatedPost = {
        slug: 'test-post',
        title: 'Updated Title',
        description: 'Test description',
        content: 'Test content',
        tags: ['test'],
        category: 'tech',
        published: true,
        published_at: new Date().toISOString(),
      }

      const mockUpdate = vi.fn().mockReturnThis()
      const mockEq = vi.fn().mockReturnThis()
      const mockSelect = vi.fn().mockReturnThis()
      const mockSingle = vi.fn().mockResolvedValue({ data: mockUpdatedPost, error: null })

      vi.mocked(supabaseAdmin!.from).mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
        select: mockSelect,
        single: mockSingle,
      } as any)

      const result = await db.blog.update('test-post', { title: 'Updated Title' })

      expect(mockUpdate).toHaveBeenCalled()
      expect(mockEq).toHaveBeenCalledWith('slug', 'test-post')
      expect(result.title).toBe('Updated Title')
    })

    it('should delete blog post', async () => {
      const mockDelete = vi.fn().mockReturnThis()
      const mockEq = vi.fn().mockResolvedValue({ data: null, error: null })

      vi.mocked(supabaseAdmin!.from).mockReturnValue({
        delete: mockDelete,
        eq: mockEq,
      } as any)

      await db.blog.delete('test-post')

      expect(mockDelete).toHaveBeenCalled()
      expect(mockEq).toHaveBeenCalledWith('slug', 'test-post')
    })
  })

  describe('Content Operations', () => {
    it('should fetch content by page type', async () => {
      const mockContent = {
        hero: {
          title: 'Test',
          subtitle: 'Test subtitle',
        },
      }

      const mockSelect = vi.fn().mockReturnThis()
      const mockEq = vi.fn().mockReturnThis()
      const mockSingle = vi.fn().mockResolvedValue({
        data: { content: mockContent },
        error: null,
      })

      vi.mocked(supabaseAdmin!.from).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      } as any)

      const content = await db.content.get('home')

      expect(content).toEqual(mockContent)
      expect(mockEq).toHaveBeenCalledWith('page_type', 'home')
    })

    it('should set content for page type', async () => {
      const mockContent = {
        hero: {
          title: 'Updated',
          subtitle: 'Updated subtitle',
        },
      }

      const mockUpsert = vi.fn().mockResolvedValue({ data: null, error: null })

      vi.mocked(supabaseAdmin!.from).mockReturnValue({
        upsert: mockUpsert,
      } as any)

      await db.content.set('home', mockContent)

      expect(mockUpsert).toHaveBeenCalledWith(
        { page_type: 'home', content: mockContent },
        { onConflict: 'page_type' }
      )
    })
  })

  describe('Life Moments Operations', () => {
    it('should fetch all life moments', async () => {
      const mockMoments = [
        {
          id: '1',
          date: '2024-01-01',
          type: 'scuba',
          title: 'Test Dive',
          location: 'Test Location',
          description: 'Test description',
        },
      ]

      const mockSelect = vi.fn().mockReturnThis()
      const mockEq = vi.fn().mockReturnThis()
      const mockSingle = vi.fn().mockResolvedValue({
        data: { content: mockMoments },
        error: null,
      })

      vi.mocked(supabaseAdmin!.from).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      } as any)

      const moments = await db.content.get('life')

      expect(moments).toEqual(mockMoments)
    })
  })

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      const mockSelect = vi.fn().mockReturnThis()
      const mockOrder = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      })

      vi.mocked(supabaseAdmin!.from).mockReturnValue({
        select: mockSelect,
        order: mockOrder,
      } as any)

      await expect(db.blog.getAll()).rejects.toThrow()
    })

    it('should handle null responses', async () => {
      const mockSelect = vi.fn().mockReturnThis()
      const mockEq = vi.fn().mockReturnThis()
      const mockSingle = vi.fn().mockResolvedValue({ data: null, error: null })

      vi.mocked(supabaseAdmin!.from).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      } as any)

      const post = await db.blog.getBySlug('non-existent')

      expect(post).toBeNull()
    })
  })
})

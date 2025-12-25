'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { BlogEditor } from '@/components/BlogEditor'
import { BlogPost } from '@/types'

export default function EditBlogPostPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPost()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/admin/posts/${slug}`)
      const data = await response.json()
      if (data.post) {
        setPost(data.post)
      }
    } catch (error) {
      console.error('Failed to fetch post:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (postData: any) => {
    try {
      const response = await fetch(`/api/admin/posts/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      })

      const data = await response.json()
      if (data.success) {
        router.push('/admin')
      } else {
        alert(data.message || 'Failed to save post')
      }
    } catch (error) {
      alert('Error saving post')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-off flex items-center justify-center">
        <p className="text-ocean-base">Loading...</p>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-neutral-off flex items-center justify-center">
        <p className="text-ocean-base">Post not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-off py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-serif text-4xl text-ocean-deep mb-2">Edit Blog Post</h1>
          <p className="text-ocean-base">Editing: {post.title}</p>
        </div>
        <BlogEditor post={post} onSave={handleSave} />
      </div>
    </div>
  )
}


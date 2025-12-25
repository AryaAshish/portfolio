'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BlogEditor } from '@/components/BlogEditor'

export default function NewBlogPostPage() {
  const router = useRouter()

  const handleSave = async (postData: any) => {
    try {
      const response = await fetch('/api/admin/posts', {
        method: 'POST',
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

  return (
    <div className="min-h-screen bg-neutral-off py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-serif text-4xl text-ocean-deep mb-2">New Blog Post</h1>
          <p className="text-ocean-base">Create a new blog post</p>
        </div>
        <BlogEditor onSave={handleSave} />
      </div>
    </div>
  )
}




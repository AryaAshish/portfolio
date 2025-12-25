'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BlogPost } from '@/types'

export default function AdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')

  useEffect(() => {
    const auth = localStorage.getItem('admin_authenticated')
    if (auth === 'true') {
      setAuthenticated(true)
      fetchPosts()
    } else {
      setLoading(false)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    const data = await response.json()
    if (data.success) {
      localStorage.setItem('admin_authenticated', 'true')
      setAuthenticated(true)
      fetchPosts()
    } else {
      alert('Invalid password')
    }
  }

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/admin/posts')
      const data = await response.json()
      setPosts(data.posts || [])
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const response = await fetch(`/api/admin/posts/${slug}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchPosts()
      } else {
        alert('Failed to delete post')
      }
    } catch (error) {
      alert('Error deleting post')
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-neutral-off flex items-center justify-center">
        <div className="bg-neutral-white rounded-xl p-8 shadow-lg max-w-md w-full">
          <h1 className="font-serif text-3xl text-ocean-deep mb-6">Admin Login</h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-ocean-deep mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-teal-base text-neutral-white rounded-lg font-medium hover:bg-teal-dark transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-off flex items-center justify-center">
        <p className="text-ocean-base">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-off py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-serif text-4xl text-ocean-deep">Content Management</h1>
          <button
            onClick={() => {
              localStorage.removeItem('admin_authenticated')
              setAuthenticated(false)
            }}
            className="px-6 py-3 bg-ocean-light text-ocean-deep rounded-lg font-medium hover:bg-ocean-base transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Link
            href="/admin/subscribers"
            className="bg-gradient-to-br from-teal-base to-teal-dark rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 text-neutral-white"
          >
            <h3 className="font-serif text-2xl mb-2">Newsletter Subscribers</h3>
            <p className="text-neutral-white/90 text-sm">View and export subscriber list</p>
          </Link>

          <Link
            href="/admin/content/home"
            className="bg-neutral-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-ocean-light/20"
          >
            <h3 className="font-serif text-2xl text-ocean-deep mb-2">Home Page</h3>
            <p className="text-ocean-base text-sm">Edit hero, sections, and CTAs</p>
          </Link>

          <Link
            href="/admin/content/about"
            className="bg-neutral-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-ocean-light/20"
          >
            <h3 className="font-serif text-2xl text-ocean-deep mb-2">About Page</h3>
            <p className="text-ocean-base text-sm">Edit personal journey and story</p>
          </Link>

          <Link
            href="/admin/content/experience"
            className="bg-neutral-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-ocean-light/20"
          >
            <h3 className="font-serif text-2xl text-ocean-deep mb-2">Experience</h3>
            <p className="text-ocean-base text-sm">Manage work experience entries</p>
          </Link>

          <Link
            href="/admin/content/skills"
            className="bg-neutral-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-ocean-light/20"
          >
            <h3 className="font-serif text-2xl text-ocean-deep mb-2">Skills</h3>
            <p className="text-ocean-base text-sm">Update skills and technologies</p>
          </Link>

          <Link
            href="/admin/content/life"
            className="bg-neutral-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-ocean-light/20"
          >
            <h3 className="font-serif text-2xl text-ocean-deep mb-2">Life Moments</h3>
            <p className="text-ocean-base text-sm">Manage scuba, travel, bike moments</p>
          </Link>

          <Link
            href="/admin/content/courses"
            className="bg-neutral-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-ocean-light/20"
          >
            <h3 className="font-serif text-2xl text-ocean-deep mb-2">Courses</h3>
            <p className="text-ocean-base text-sm">Manage course offerings</p>
          </Link>

          <Link
            href="/admin/content/hire"
            className="bg-neutral-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-ocean-light/20"
          >
            <h3 className="font-serif text-2xl text-ocean-deep mb-2">Hire Page</h3>
            <p className="text-ocean-base text-sm">Edit recruiter-focused hire page</p>
          </Link>

          <Link
            href="/admin/blog/new"
            className="bg-neutral-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-ocean-light/20"
          >
            <h3 className="font-serif text-2xl text-ocean-deep mb-2">New Blog Post</h3>
            <p className="text-ocean-base text-sm">Create a new blog post</p>
          </Link>

          <Link
            href="/admin/planner"
            className="bg-gradient-to-br from-ocean-deep to-ocean-dark rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 text-neutral-white"
          >
            <h3 className="font-serif text-2xl mb-2">Personal Planner</h3>
            <p className="text-neutral-white/90 text-sm">Calendar, Journal, Finances & Items</p>
          </Link>
        </div>

        <div className="bg-neutral-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-ocean-deep text-neutral-white">
            <h2 className="font-serif text-2xl">Blog Posts</h2>
          </div>
          <table className="w-full">
            <thead className="bg-ocean-pale/20">
              <tr>
                <th className="px-6 py-4 text-left font-serif text-ocean-deep">Title</th>
                <th className="px-6 py-4 text-left font-serif text-ocean-deep">Status</th>
                <th className="px-6 py-4 text-left font-serif text-ocean-deep">Date</th>
                <th className="px-6 py-4 text-left font-serif text-ocean-deep">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.slug} className="border-b border-ocean-light/20">
                  <td className="px-6 py-4">
                    <div className="font-medium text-ocean-deep">{post.title}</div>
                    <div className="text-sm text-ocean-light">{post.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        post.published
                          ? 'bg-teal-light/20 text-teal-dark'
                          : 'bg-ocean-light/20 text-ocean-base'
                      }`}
                    >
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-ocean-base">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/blog/${post.slug}`}
                        className="px-4 py-2 bg-ocean-pale/20 text-ocean-base rounded-lg text-sm font-medium hover:bg-teal-light/20 transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(post.slug)}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {posts.length === 0 && (
            <div className="p-12 text-center text-ocean-base">
              <p>No blog posts yet. Create your first one!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

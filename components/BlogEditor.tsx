'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { BlogPost } from '@/types'
import { ComponentInsertModal } from './ComponentInsertModal'
import { ImageUpload } from './ImageUpload'
import { AIBlogAssistant } from './AIBlogAssistant'

interface BlogEditorProps {
  post?: BlogPost
  onSave: (postData: any) => void
}

const availableComponents = [
  { type: 'JourneyMap', name: 'Journey Map', icon: '🗺️' },
  { type: 'DiveLog', name: 'Dive Log', icon: '🌊' },
  { type: 'RideRoute', name: 'Ride Route', icon: '🏍️' },
  { type: 'CodeFromLocation', name: 'Code from Location', icon: '💻' },
  { type: 'JourneyStats', name: 'Journey Stats', icon: '📊' },
  { type: 'LocationCard', name: 'Location Card', icon: '📍' },
  { type: 'StoryTimeline', name: 'Story Timeline', icon: '📅' },
]

export function BlogEditor({ post, onSave }: BlogEditorProps) {
  const [title, setTitle] = useState(post?.title || '')
  const [description, setDescription] = useState(post?.description || '')
  const [content, setContent] = useState(post?.content || '')
  const [tags, setTags] = useState(post?.tags.join(', ') || '')
  const [category, setCategory] = useState(post?.category || 'general')
  const [published, setPublished] = useState(post?.published ?? true)
  const [slug, setSlug] = useState(post?.slug || '')
  const [date, setDate] = useState(
    post?.publishedAt ? new Date(post.publishedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  )
  const [saving, setSaving] = useState(false)
  const [showComponentModal, setShowComponentModal] = useState(false)
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)
  const [featuredImage, setFeaturedImage] = useState<string | null>(post?.image || null)
  const [videoUrl, setVideoUrl] = useState(post?.videoUrl || '')
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null)
  const isInitialized = useRef(false)

  useEffect(() => {
    if (!isInitialized.current && post) {
      setTitle(post.title || '')
      setDescription(post.description || '')
      setContent(post.content || '')
      setTags(post.tags.join(', ') || '')
      setCategory(post.category || 'general')
      setPublished(post.published ?? true)
      setSlug(post.slug || '')
      setDate(post.publishedAt ? new Date(post.publishedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0])
      setFeaturedImage(post?.image || null)
      setVideoUrl(post?.videoUrl || '')
      isInitialized.current = true
    }
  }, [post])

  useEffect(() => {
    if (!post && title && !isInitialized.current) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setSlug(generatedSlug)
    }
  }, [title, post])

  const insertComponent = (code: string) => {
    const textarea = contentTextareaRef.current
    if (!textarea) {
      console.error('Textarea ref not available')
      return
    }

    // Get current content value (might have changed)
    const currentContent = content
    const start = textarea.selectionStart || currentContent.length
    const end = textarea.selectionEnd || currentContent.length
    const textBefore = currentContent.substring(0, start)
    const textAfter = currentContent.substring(end)
    const newContent = textBefore + '\n\n' + code + '\n\n' + textAfter
    
    console.log('Inserting component, new content length:', newContent.length)
    setContent(newContent)
    
    // Use requestAnimationFrame to ensure DOM is updated
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (textarea) {
          textarea.focus()
          const newCursorPos = start + code.length + 4
          textarea.setSelectionRange(newCursorPos, newCursorPos)
        }
      }, 50)
    })
  }

  const handleComponentClick = (componentType: string) => {
    console.log('Component clicked:', componentType)
    // Use a small timeout to ensure state updates properly
    setTimeout(() => {
      setSelectedComponent(componentType)
      setShowComponentModal(true)
    }, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Don't submit if modal is open
    if (showComponentModal) {
      console.log('Form submission prevented - modal is open')
      return
    }
    
    setSaving(true)

    const postData = {
      title,
      description,
      content,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      category,
      published,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      date,
      publishedAt: date,
      image: featuredImage,
      videoUrl: videoUrl || undefined,
    }

    try {
      await onSave(postData)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
    <form 
      onSubmit={handleSubmit} 
      className="bg-neutral-white rounded-xl p-8 shadow-lg space-y-6"
      onKeyDown={(e) => {
        // Prevent Enter key from submitting form when modal is open
        if (showComponentModal && e.key === 'Enter') {
          e.preventDefault()
        }
      }}
    >
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-ocean-deep mb-2">
          Title *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
          required
        />
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-ocean-deep mb-2">
          Slug (URL) *
        </label>
        <input
          type="text"
          id="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base font-mono text-sm"
          required
          pattern="[a-z0-9-]+"
          title="Lowercase letters, numbers, and hyphens only"
        />
        <p className="text-xs text-ocean-light mt-1">
          URL-friendly identifier (auto-generated from title)
        </p>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-ocean-deep mb-2">
          Description *
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
          required
        />
        <p className="text-xs text-ocean-light mt-1">Used in previews and SEO</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-ocean-deep mb-2">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
          >
            <option value="tech">Tech</option>
            <option value="career">Career</option>
            <option value="travel">Travel</option>
            <option value="life">Life</option>
            <option value="general">General</option>
          </select>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-ocean-deep mb-2">
            Date
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-ocean-deep mb-2">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="android, kotlin, architecture"
          className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
        />
        <p className="text-xs text-ocean-light mt-1">Separate tags with commas</p>
      </div>

      <div>
        <ImageUpload
          bucket="blog-images"
          label="Featured Image (optional)"
          existingImage={featuredImage || undefined}
          onUploadComplete={(url) => {
            setFeaturedImage(url)
          }}
          onDelete={() => {
            setFeaturedImage(null)
          }}
        />
        <p className="text-xs text-ocean-light mt-1">This image will be used as the blog post cover image</p>
      </div>

      <div>
        <label htmlFor="videoUrl" className="block text-sm font-medium text-ocean-deep mb-2">
          YouTube Video URL (optional)
        </label>
        <input
          type="url"
          id="videoUrl"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
        />
        <p className="text-xs text-ocean-light mt-1">
          Add a YouTube video URL to embed it in your blog post. You can also use <code className="text-xs bg-ocean-pale/20 px-1 py-0.5 rounded">&lt;YouTubeEmbed videoId="..." /&gt;</code> in your content.
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="content" className="block text-sm font-medium text-ocean-deep">
            Content (Markdown) *
          </label>
        </div>
        <div className="mb-2 p-3 bg-ocean-pale/10 rounded-lg border border-ocean-light/30">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-ocean-deep">Insert Component:</span>
            {availableComponents.map((comp) => (
              <button
                key={comp.type}
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log('Button clicked:', comp.type)
                  handleComponentClick(comp.type)
                }}
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                className="px-3 py-1.5 text-xs bg-teal-base/10 hover:bg-teal-base/20 active:bg-teal-base/30 text-teal-dark rounded-lg transition-colors flex items-center gap-1.5 border border-teal-base/30 font-medium cursor-pointer"
                title={comp.name}
              >
                <span className="text-base">{comp.icon}</span>
                <span className="hidden sm:inline">{comp.name}</span>
              </button>
            ))}
          </div>
        </div>
        <textarea
          ref={contentTextareaRef}
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={20}
          className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base font-mono text-sm"
          required
          placeholder="# Your Post Title

Write your content here in Markdown format..."
        />
        <p className="text-xs text-ocean-light mt-1">
          Supports Markdown and MDX components. Click the buttons above to insert interactive components.
        </p>
      </div>

      {typeof window !== 'undefined' && showComponentModal && selectedComponent && createPortal(
        <ComponentInsertModal
          componentType={selectedComponent}
          onInsert={insertComponent}
          onClose={() => {
            setShowComponentModal(false)
            setSelectedComponent(null)
          }}
        />,
        document.body
      )}

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="w-4 h-4 text-teal-base rounded focus:ring-teal-base"
          />
          <span className="text-ocean-deep font-medium">Published</span>
        </label>
        <p className="text-sm text-ocean-light">
          {published ? 'Post will be visible on the blog' : 'Saved as draft'}
        </p>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 bg-teal-base text-neutral-white rounded-lg font-medium hover:bg-teal-dark transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Post'}
        </button>
        <a
          href="/admin"
          className="px-8 py-3 bg-ocean-light text-ocean-deep rounded-lg font-medium hover:bg-ocean-base transition-colors"
        >
          Cancel
        </a>
      </div>
    </form>
    
    <AIBlogAssistant
      title={title}
      description={description}
      content={content}
      onOutlineGenerated={(outline) => {
        setContent(outline)
      }}
      onWritingImproved={(improved) => {
        setContent(improved)
      }}
      onSEOOptimized={(data) => {
        if (data.metaDescription) {
          setDescription(data.metaDescription)
        }
        if (data.keywords.length > 0) {
          const existingTags = tags.split(',').map(t => t.trim()).filter(Boolean)
          const newTags = [...new Set([...existingTags, ...data.keywords])].join(', ')
          setTags(newTags)
        }
        alert(`SEO Suggestions:\n\n${data.suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}`)
      }}
      onMetaGenerated={(meta) => {
        setDescription(meta)
      }}
      onCodeExplained={(explanation) => {
        const textarea = contentTextareaRef.current
        if (textarea) {
          const start = textarea.selectionStart || content.length
          const end = textarea.selectionEnd || content.length
          const textBefore = content.substring(0, start)
          const textAfter = content.substring(end)
          const newContent = textBefore + '\n\n' + explanation + '\n\n' + textAfter
          setContent(newContent)
        } else {
          setContent(content + '\n\n' + explanation + '\n\n')
        }
      }}
      onTopicsSuggested={(topics) => {
        alert(`Related Topics:\n\n${topics.map((t, i) => `${i + 1}. ${t}`).join('\n')}\n\nYou can use these as inspiration for future blog posts!`)
      }}
    />
    </>
  )
}



'use client'

interface YouTubeEmbedProps {
  videoId: string
  title?: string
  className?: string
}

export function YouTubeEmbed({ videoId, title, className = '' }: YouTubeEmbedProps) {
  // Extract video ID from URL if full URL is provided
  const extractVideoId = (idOrUrl: string): string => {
    if (!idOrUrl) return ''
    
    // If it's already just an ID (11 characters, alphanumeric, hyphens, underscores)
    if (/^[a-zA-Z0-9_-]{11}$/.test(idOrUrl)) {
      return idOrUrl
    }
    
    // Extract from various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
    ]
    
    for (const pattern of patterns) {
      const match = idOrUrl.match(pattern)
      if (match && match[1]) {
        return match[1]
      }
    }
    
    return idOrUrl
  }

  const cleanVideoId = extractVideoId(videoId)

  if (!cleanVideoId) {
    return (
      <div className={`p-4 bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <p className="text-red-700 text-sm">Invalid YouTube video URL or ID</p>
      </div>
    )
  }

  return (
    <div className={`my-8 ${className}`}>
      <div className="relative w-full pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-lg">
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={`https://www.youtube.com/embed/${cleanVideoId}`}
          title={title || 'YouTube video player'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      </div>
      {title && (
        <p className="mt-2 text-sm text-ocean-base text-center">{title}</p>
      )}
    </div>
  )
}



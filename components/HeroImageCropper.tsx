'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ImageUpload } from './ImageUpload'

interface CoralImage {
  url: string
  cropX?: number
  cropY?: number
  cropWidth?: number
  cropHeight?: number
}

interface HeroImageCropperProps {
  images: CoralImage[]
  onChange: (images: CoralImage[]) => void
}

export function HeroImageCropper({ images, onChange }: HeroImageCropperProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const addImage = (url: string) => {
    onChange([...images, { url, cropX: 50, cropY: 50 }])
  }

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index))
  }

  const updateImage = (index: number, updates: Partial<CoralImage>) => {
    const newImages = images.map((img, i) => 
      i === index ? { ...img, ...updates } : img
    )
    onChange(newImages)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-ocean-deep mb-4">
          Hero Background Images ({images.length}/3 recommended)
        </h3>
        <p className="text-sm text-ocean-base mb-4">
          Images will automatically slide every 5 seconds. Upload up to 3 images for variety.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index} className="bg-neutral-off rounded-lg p-4 border border-ocean-light/20">
            <div className="relative w-full h-40 mb-3 rounded-lg overflow-hidden bg-ocean-pale/10">
              <Image
                src={image.url}
                alt={`Hero image ${index + 1}`}
                fill
                className="object-cover"
                style={{
                  objectPosition: `${image.cropX || 50}% ${image.cropY || 50}%`,
                }}
                unoptimized={image.url.includes('supabase.co')}
              />
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-ocean-deep mb-1">
                  Horizontal Position (%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={image.cropX || 50}
                  onChange={(e) => updateImage(index, { cropX: parseInt(e.target.value) })}
                  className="w-full"
                />
                <span className="text-xs text-ocean-light">{image.cropX || 50}%</span>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-ocean-deep mb-1">
                  Vertical Position (%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={image.cropY || 50}
                  onChange={(e) => updateImage(index, { cropY: parseInt(e.target.value) })}
                  className="w-full"
                />
                <span className="text-xs text-ocean-light">{image.cropY || 50}%</span>
              </div>

              <button
                type="button"
                onClick={() => removeImage(index)}
                className="w-full px-3 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
              >
                Remove Image
              </button>
            </div>
          </div>
        ))}

        {images.length < 5 && (
          <div className="bg-neutral-off rounded-lg p-4 border-2 border-dashed border-ocean-light/40">
            <ImageUpload
              bucket="site-images"
              onUploadComplete={addImage}
              label="Add Background Image"
            />
            <p className="text-xs text-ocean-light mt-2">
              Upload a new image to add to the carousel
            </p>
          </div>
        )}
      </div>

      <div className="bg-teal-light/10 rounded-lg p-4">
        <h4 className="text-sm font-medium text-ocean-deep mb-2">Carousel Order</h4>
        <div className="flex gap-2">
          {images.map((_, index) => (
            <div
              key={index}
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium bg-ocean-pale/30 text-ocean-base border-2 border-teal-base"
            >
              {index + 1}
            </div>
          ))}
        </div>
        <p className="text-xs text-ocean-light mt-2">
          Images cycle automatically every 5 seconds in this order
        </p>
      </div>
    </div>
  )
}


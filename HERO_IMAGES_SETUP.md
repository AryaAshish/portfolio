# Hero Background Images Setup

## Overview

The hero section now uses a carousel of coral/underwater images that automatically slide every 5 seconds. You can manage these images via the admin panel with crop controls.

## Features

- **Auto-sliding carousel**: Images transition every 5 seconds
- **Smooth animations**: 1-second slide transition between images
- **Crop controls**: Adjust horizontal and vertical positioning for each image
- **Supabase storage**: Images are hosted on Supabase for reliability
- **Admin management**: Upload, crop, and remove images from the admin panel

## Images Uploaded to Supabase

1. `https://sxyfqzblgpqjhqxcomau.supabase.co/storage/v1/object/public/site-images/hero-corals/275594981_641387613759403_4598945770693618534_n.webp.jpg`
2. `https://sxyfqzblgpqjhqxcomau.supabase.co/storage/v1/object/public/site-images/hero-corals/275828749_227700996211204_8693221892605276577_n.webp.jpg`
3. `https://sxyfqzblgpqjhqxcomau.supabase.co/storage/v1/object/public/site-images/hero-corals/IMG20231127131252_Copy.JPG`

## Managing Hero Images

### Via Admin Panel

1. Go to `/admin`
2. Click **Content** → **Home Page**
3. Scroll to **Hero Background Images** section
4. You can:
   - **Add images**: Click "Add Background Image" to upload new images
   - **Crop images**: Use sliders to adjust horizontal/vertical positioning
   - **Remove images**: Click "Remove Image" on any image
   - **Preview**: See the carousel preview with current images

### Manual Edit (content/home.json)

```json
{
  "hero": {
    "coralImages": [
      {
        "url": "https://supabase.co/storage/...",
        "cropX": 50,
        "cropY": 50
      }
    ]
  }
}
```

## Crop Controls

- **Horizontal Position (cropX)**: 0% (left) to 100% (right)
- **Vertical Position (cropY)**: 0% (top) to 100% (bottom)
- Default: 50% (center)

Use these to adjust which part of the image is visible in the hero section.

## Technical Details

### Component Structure

- `Hero.tsx`: Main hero component with carousel logic
- `HeroImageCropper.tsx`: Admin component for managing images
- Images stored in `site-images/hero-corals/` bucket

### Animation

- Duration: 1 second
- Interval: 5 seconds between slides
- Transition: Horizontal slide with fade (easeInOut)

### Fallback

If no `coralImages` are configured, the hero falls back to local images in `/public/`.

## Upload New Images

### Via Admin Panel (Recommended)

1. Go to `/admin/content/home`
2. Click "Add Background Image" in the Hero Background Images section
3. Upload your image
4. Adjust crop position with sliders
5. Save

### Via Script

```bash
# Upload images to Supabase
npx tsx scripts/upload-coral-images.ts
```

This uploads all images from `public/` to Supabase Storage.

## Best Practices

- **Image size**: 1920x1080 or larger for best quality
- **File format**: JPEG for underwater/photo images
- **Number of images**: 3-5 images work well for variety
- **Crop wisely**: Adjust crop to ensure coral/interesting parts are visible
- **Test on mobile**: Preview how images look on different screen sizes

## Troubleshooting

**Images not showing**
- Check that URLs are accessible (visit them in browser)
- Verify Supabase bucket is public
- Check browser console for errors

**Carousel not working**
- Ensure `coralImages` array has at least 2 images
- Check that each image has a valid URL

**Crop not working**
- Adjust cropX and cropY values (0-100)
- Save and refresh the homepage to see changes



# Video Upload Guide

## Large Video Files (>50MB)

Supabase free plan has a **50MB limit** for direct API uploads. For larger files (like your 92MB video), you have two options:

### Option 1: Upload via Supabase Dashboard (Recommended)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Storage** → **videos** bucket
4. Click **Upload file**
5. Select your video file (`vecteezy_underwater-scene-multiple-clownfish-swimming-in-anemone_33344055.mov`)
6. Wait for upload to complete
7. Click on the uploaded file to view details
8. Copy the **Public URL**
9. Go to `/admin/content/home` in your portfolio
10. Paste the URL in the "Background Video URL" field (or use the manual URL input in the Video Upload component)

### Option 2: Use Manual URL Input

1. Upload your video to Supabase Storage (via Dashboard as above)
2. In the admin panel, use the "Paste video URL directly" option
3. Paste the public URL from Supabase
4. Click "Use URL"

## Video URL Format

The URL should look like:
```
https://your-project-id.supabase.co/storage/v1/object/public/videos/hero-background.mov
```

## Notes

- Videos are served via Supabase CDN for fast global delivery
- The video will autoplay, loop, and be muted as a background
- The animated underwater scene will show as a loader until the video loads
- Once loaded, the video will smoothly fade in



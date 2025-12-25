# Social Media Integration Setup Guide

This guide will help you set up YouTube and Instagram API integrations to automatically fetch and display your latest posts on your homepage.

## Overview

The system automatically:
- Fetches your latest YouTube videos and Instagram posts
- Caches them in Supabase (refreshes every 60 minutes)
- Displays thumbnails on your homepage
- Falls back to cached data if API calls fail

## YouTube Setup

### Step 1: Get YouTube Channel ID

1. Go to [YouTube Studio](https://studio.youtube.com/)
2. Click on **Settings** → **Channel** → **Advanced settings**
3. Your **Channel ID** is listed there (starts with `UC...`)

Alternatively:
- Go to your YouTube channel page
- View page source (Ctrl/Cmd + U)
- Search for `"channelId"` - the value after it is your Channel ID

### Step 2: Create Google Cloud Project & API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable **YouTube Data API v3**:
   - Go to **APIs & Services** → **Library**
   - Search for "YouTube Data API v3"
   - Click **Enable**
4. Create API Key:
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **API Key**
   - Copy the API key
   - (Optional) Restrict the key to YouTube Data API v3 for security

### Step 3: Add to Environment Variables

Add these to your `.env.local`:

```env
YOUTUBE_API_KEY=your_api_key_here
YOUTUBE_CHANNEL_ID=UCyour_channel_id_here
```

## Instagram Setup

### Prerequisites

- Your Instagram account must be a **Business** or **Creator** account
- You need a **Facebook Page** connected to your Instagram account

### Step 1: Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **My Apps** → **Create App**
3. Choose **Business** as the app type
4. Fill in app details and create

### Step 2: Add Instagram Basic Display Product

1. In your Facebook App dashboard, click **Add Product**
2. Find **Instagram Basic Display** and click **Set Up**
3. Add **Instagram App ID** and **Instagram App Secret** to your notes

### Step 3: Get Access Token

**Option A: Using Graph API Explorer (Easier)**

1. Go to [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app from the dropdown
3. Click **Generate Access Token**
4. Select permissions: `instagram_basic`, `pages_read_engagement`
5. Copy the access token

**Option B: Using OAuth Flow (Production)**

1. Set up OAuth redirect URL in your app settings
2. Implement OAuth flow to get long-lived access token
3. Exchange short-lived token for long-lived token (60 days)

### Step 4: Get Instagram User ID

1. Use Graph API Explorer or make a request:
   ```
   GET https://graph.instagram.com/me?fields=id,username&access_token=YOUR_ACCESS_TOKEN
   ```
2. The `id` field is your Instagram User ID

### Step 5: Add to Environment Variables

Add these to your `.env.local`:

```env
INSTAGRAM_ACCESS_TOKEN=your_access_token_here
INSTAGRAM_USER_ID=your_user_id_here
```

## Usage

### Add to Homepage

Add the `SocialFeed` component to your homepage:

```tsx
import { SocialFeed } from '@/components/SocialFeed'

// In your page component:
<SocialFeed platform="youtube" limit={6} title="Latest Videos" />
<SocialFeed platform="instagram" limit={6} title="Latest Posts" />
```

### API Endpoints

- `GET /api/social/youtube?limit=6` - Fetch YouTube videos
- `GET /api/social/instagram?limit=6` - Fetch Instagram posts
- `?refresh=true` - Force refresh (bypass cache)

### Caching

- Posts are cached in Supabase for 60 minutes
- Cache is automatically refreshed when expired
- Falls back to cached data if API fails

## Troubleshooting

### YouTube Issues

**Error: "API key not valid"**
- Check that YouTube Data API v3 is enabled
- Verify API key is correct
- Check API key restrictions

**Error: "Channel not found"**
- Verify Channel ID is correct (starts with `UC`)
- Make sure channel is public

**No videos returned**
- Check that your channel has published videos
- Verify `maxResults` parameter

### Instagram Issues

**Error: "Invalid access token"**
- Access tokens expire (short-lived: 1 hour, long-lived: 60 days)
- Generate a new token
- For production, implement token refresh

**Error: "User not found"**
- Verify Instagram User ID is correct
- Check that account is Business/Creator type
- Ensure Facebook Page is connected

**No posts returned**
- Check that account has public posts
- Verify access token has correct permissions

## Rate Limits

### YouTube
- Free tier: 10,000 units/day
- 1 search = 100 units
- 1 video list = 1 unit
- Caching helps stay within limits

### Instagram
- 200 requests/hour per user
- Caching reduces API calls significantly

## Security Notes

1. **Never commit API keys** to version control
2. Use environment variables for all credentials
3. Restrict API keys to specific APIs/IPs when possible
4. Rotate access tokens regularly
5. Use long-lived tokens for production (Instagram)

## Testing

After setup, test the endpoints:

```bash
# Test YouTube
curl http://localhost:3000/api/social/youtube

# Test Instagram
curl http://localhost:3000/api/social/instagram

# Force refresh
curl http://localhost:3000/api/social/youtube?refresh=true
```

## Next Steps

1. Apply the database migration (if not done automatically)
2. Add environment variables
3. Test API endpoints
4. Add `SocialFeed` components to your homepage
5. Customize styling as needed



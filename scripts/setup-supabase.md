# Quick Supabase Setup Instructions

## Step 1: Get Your Service Role Key

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `sxyfqzblgpqjhqxcomau`
3. Go to **Settings** → **API**
4. Scroll down to **Project API keys**
5. Copy the **service_role** key (it's the secret one, keep it safe!)
6. Update `.env.local`:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here
   ```

## Step 2: Set Up Database Schema

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `supabase/schema.sql`
4. Paste into the SQL Editor
5. Click **Run** (or press Cmd/Ctrl + Enter)

This will create:
- `blog_posts` table
- `content_pages` table  
- `newsletter_subscribers` table
- Indexes and security policies

## Step 3: Test Connection

After setting up the schema, you can test by:
1. Setting `USE_SUPABASE=true` in `.env.local`
2. Restarting your dev server
3. Going to `/admin/subscribers` - it should work!

## Step 4: Migrate Existing Data (Optional)

If you have existing blog posts and content:

```bash
npm run migrate:supabase
```

This will copy all your existing content from files to Supabase.

## Step 5: Enable Supabase

Once everything is tested:
1. Set `USE_SUPABASE=true` in `.env.local`
2. Restart dev server
3. Your portfolio now uses Supabase! 🎉



# Supabase Setup Guide

This guide will help you set up Supabase for your portfolio to store blog posts, content, and newsletter subscribers.

## Step 1: Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project or select your existing project
3. Go to **Settings** → **API**
4. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (under "Project API keys")
   - **service_role key** (under "Project API keys" - keep this secret!)

## Step 2: Set Up Database Schema

1. In Supabase Dashboard, go to **SQL Editor**
2. Open the file `supabase/schema.sql` from this project
3. Copy and paste the entire SQL into the SQL Editor
4. Click **Run** to execute the schema

This will create:
- `blog_posts` table for blog posts
- `content_pages` table for static content (home, about, experience, etc.)
- `newsletter_subscribers` table for email subscribers
- Indexes and Row Level Security policies

## Step 3: Configure Environment Variables

✅ **Already configured in `.env.local`!**

Your current setup:
```env
NEXT_PUBLIC_SUPABASE_URL=https://sxyfqzblgpqjhqxcomau.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_3fwpUbhnzQYYMBU1q7I9fQ_ufBq_txm
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here  # ⚠️ Still needs to be updated
SUPABASE_DB_PASSWORD=RpvEygxn_Wf_6LR
USE_SUPABASE=false
```

**Next:** Get your service_role key from Supabase Dashboard → Settings → API → Project API keys (the secret one), and update `.env.local`

## Step 4: Migrate Existing Data (Optional)

If you have existing content in your `content/` folder:

1. Set `USE_SUPABASE=true` temporarily in `.env.local`
2. Run the migration script:
   ```bash
   npx tsx scripts/migrate-to-supabase.ts
   ```
3. This will copy all your existing blog posts and content to Supabase

## Step 5: Enable Supabase

Once migration is complete and you've verified everything works:

1. Set `USE_SUPABASE=true` in `.env.local`
2. Restart your dev server
3. Your admin panel will now use Supabase instead of file system

## Features

### Blog Posts
- All blog posts are stored in Supabase
- Full CRUD operations via admin panel
- Automatic slug generation
- Tag and category filtering

### Content Pages
- Home, About, Experience, Skills, Courses, Life pages
- All editable via admin panel
- Stored as JSONB for flexibility

### Newsletter Subscribers
- Subscribers are saved to Supabase
- Also sent to your external provider (Resend/Mailchimp)
- View and export subscribers in `/admin/subscribers`
- CSV export functionality

## Fallback Mode

If `USE_SUPABASE=false` or Supabase is not configured, the system will:
- Use file-based storage (current behavior)
- Continue working as before
- No data loss or breaking changes

## Troubleshooting

### "Supabase not configured" error
- Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Verify your keys are correct in Supabase Dashboard

### "Service role key not set" error
- Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local`
- This key is needed for admin operations

### Migration fails
- Check that the schema was created successfully
- Verify your service role key has proper permissions
- Check Supabase logs for detailed error messages

## Database Connection String

For direct database access (optional):
```
postgresql://postgres:RpvEygxn_Wf_6LR@db.sxyfqzblgpqjhqxcomau.supabase.co:5432/postgres
```

You can use this with database tools like pgAdmin, DBeaver, or psql.


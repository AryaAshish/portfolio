# CI/CD Deployment Setup Guide

This project uses GitHub Actions for CI/CD and Vercel for hosting.

## Workflow Overview

1. **`deploy.yml`** - Deploys to production when code is merged to `main`
2. **`ci.yml`** - Runs linting and build checks on PRs and pushes to `dev`
3. **`dev-deploy.yml`** - Creates preview deployments for `dev` branch

## Setup Instructions

### 1. Vercel Setup

First, connect your repository to Vercel:

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New Project"
3. Import your `AryaAshish/portfolio` repository
4. Vercel will automatically detect Next.js settings
5. Add your environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (if needed)

### 2. Get Vercel Credentials

After connecting to Vercel, get these values:

1. **VERCEL_TOKEN**: 
   - Go to [Vercel Account Settings → Tokens](https://vercel.com/account/tokens)
   - Create a new token with full access
   - Copy the token

2. **VERCEL_ORG_ID**:
   - Run: `vercel link` in your project (or check Vercel dashboard)
   - Or use: `vercel whoami` and check your account settings

3. **VERCEL_PROJECT_ID**:
   - Found in Vercel project settings
   - Or run: `vercel link` and check `.vercel/project.json`

### 3. Add GitHub Secrets

Add these secrets to your GitHub repository:

1. Go to: `https://github.com/AryaAshish/portfolio/settings/secrets/actions`
2. Click "New repository secret"
3. Add each secret:
   - `VERCEL_TOKEN` - Your Vercel token
   - `VERCEL_ORG_ID` - Your Vercel organization ID
   - `VERCEL_PROJECT_ID` - Your Vercel project ID
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
   - `OPENAI_API_KEY` - Your OpenAI API key

### 4. Branch Strategy

- **`main`** - Production branch (auto-deploys to production)
- **`dev`** - Development branch (creates preview deployments)

### 5. Workflow

1. Create feature branches from `dev`
2. Make changes and push to feature branch
3. Create PR to `dev` (triggers CI checks)
4. Merge to `dev` (creates preview deployment)
5. Test preview deployment
6. Create PR from `dev` to `main`
7. Merge to `main` (triggers production deployment)

## Alternative: Manual Vercel CLI Setup

If you prefer to use Vercel CLI directly:

```bash
npm i -g vercel
vercel login
vercel link
```

Then the GitHub Actions will use the linked project automatically.

## Troubleshooting

- If builds fail, check GitHub Actions logs
- Ensure all secrets are set correctly
- Verify Vercel project is connected to the correct GitHub repo
- Check that environment variables match between Vercel and GitHub secrets


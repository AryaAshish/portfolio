# GitHub Secrets Setup Guide

## Required Secrets for CI/CD

Add these secrets in your GitHub repository settings:

### Repository Settings
1. Go to: `https://github.com/AryaAshish/portfolio/settings/secrets/actions`
2. Click "New repository secret" for each one

### Secrets to Add:

#### Vercel Secrets
- **VERCEL_TOKEN**
  - Get from: Vercel Dashboard → Settings → Tokens → Create Token
  - Name it something like "GitHub Actions"
  - Copy the token value

- **VERCEL_ORG_ID**
  - Get from: Vercel Dashboard → Settings → General
  - Look for "Team ID" or "Organization ID"
  - Copy the ID

- **VERCEL_PROJECT_ID**
  - Get from: Vercel Dashboard → Your Project → Settings → General
  - Look for "Project ID"
  - Copy the ID

#### Supabase Secrets
- **NEXT_PUBLIC_SUPABASE_URL**
  - Get from: Supabase Dashboard → Project Settings → API
  - Copy the "Project URL"

- **NEXT_PUBLIC_SUPABASE_ANON_KEY**
  - Get from: Supabase Dashboard → Project Settings → API
  - Copy the "anon public" key

#### OpenAI Secret
- **OPENAI_API_KEY**
  - Get from: OpenAI Platform → API Keys
  - Create a new API key if needed
  - Copy the key value

## Verification

After adding all secrets, the workflow should run successfully when you:
- Push to `main` branch (triggers production deployment)
- Merge a PR to `main` (triggers production deployment)

## Troubleshooting

If you still get errors:
1. Verify all secrets are spelled correctly (case-sensitive)
2. Check that Vercel token has proper permissions
3. Ensure Vercel project is linked to your GitHub repository
4. Check GitHub Actions logs for specific error messages


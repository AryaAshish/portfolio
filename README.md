# Personal Portfolio Platform

A production-grade personal portfolio platform that doubles as a personal brand website, hiring funnel, content engine, and future course/paid content platform.

## Features

- **Personal Brand Website**: Premium, intentional design with oceanic theme
- **Hiring Funnel**: Embedded throughout to qualify as a strong senior engineer
- **Blog Engine**: MDX-powered blog system with tags, categories, and RSS
- **Newsletter Integration**: Abstraction layer for multiple email providers (Resend, Mailchimp)
- **Course Platform**: Future-ready architecture for paid content (Stripe-ready)
- **SEO Optimized**: Metadata, OpenGraph, sitemap, and RSS feeds
- **Content-Driven**: All content editable via MDX/JSON files

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS variables
- **Animations**: Framer Motion
- **Content**: MDX with front-matter
- **Forms**: React Hook Form + Zod validation
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables (create `.env.local`):

```env
# Newsletter Provider (resend or mailchimp)
NEWSLETTER_PROVIDER=resend
RESEND_API_KEY=your_resend_api_key
RESEND_AUDIENCE_ID=your_audience_id

# Or for Mailchimp
# NEWSLETTER_PROVIDER=mailchimp
# MAILCHIMP_API_KEY=your_mailchimp_api_key
# MAILCHIMP_SERVER_PREFIX=us1
# MAILCHIMP_LIST_ID=your_list_id

# Payments (for future course monetization)
PAYMENT_PROVIDER=stripe
STRIPE_SECRET_KEY=your_stripe_secret_key

# Site URL (for SEO and RSS)
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Admin Interface (for blog management)
ADMIN_PASSWORD=your_secure_password_here
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
portfolio/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── about/             # About page
│   ├── experience/        # Experience & Skills
│   ├── blog/              # Blog pages
│   ├── newsletter/        # Newsletter signup
│   ├── learn/             # Courses (future-ready)
│   ├── life/              # Life beyond code
│   ├── contact/            # Contact page
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # Reusable React components
├── content/               # Content files (MDX, JSON)
│   ├── blog/              # Blog posts (MDX)
│   ├── experience.json    # Work experience
│   ├── skills.json        # Skills data
│   ├── courses.json       # Course data
│   ├── life.json          # Life moments
│   └── about.md           # About page content
├── lib/                   # Utility functions
│   ├── mdx.ts            # MDX/blog utilities
│   ├── content.ts        # Content loading
│   ├── newsletter.ts     # Newsletter abstraction
│   └── payments.ts      # Payment abstraction
└── types/                 # TypeScript type definitions
```

## Blog Management

### Option 1: Web-Based Admin Interface (Recommended)

You can write and manage blog posts directly through a web interface:

1. **Set Admin Password**: Add `ADMIN_PASSWORD=your_secure_password` to `.env.local`
2. **Access Admin Panel**: Visit `/admin` on your site
3. **Login**: Enter your admin password
4. **Create/Edit Posts**: Use the visual editor to write posts
5. **Manage**: View all posts, edit, delete, or save as drafts

**Features:**
- ✅ Visual editor with Markdown support
- ✅ Live preview of post metadata
- ✅ Draft mode (save without publishing)
- ✅ Edit existing posts
- ✅ Delete posts
- ✅ Automatic slug generation from title

### Option 2: Manual MDX Files

Alternatively, you can still edit MDX files directly:

1. Create a new `.mdx` file in `content/blog/`
2. Add front-matter:

```mdx
---
title: "Your Post Title"
description: "A brief description"
date: "2024-01-01"
publishedAt: "2024-01-01"
tags: ["tag1", "tag2"]
category: "general"
published: true
---

# Your Content Here

Write your blog post in Markdown...
```

3. The post will automatically appear on the blog page

### Editing Work Experience

Edit `content/experience.json`:

```json
[
  {
    "company": "Company Name",
    "role": "Your Role",
    "period": "2022 - Present",
    "location": "Remote",
    "impact": [
      "Impact statement 1",
      "Impact statement 2"
    ],
    "technologies": ["Tech1", "Tech2"],
    "metrics": ["Metric 1", "Metric 2"]
  }
]
```

### Editing Skills

Edit `content/skills.json`:

```json
[
  {
    "category": "Mobile",
    "items": ["Android", "Kotlin", "Compose"]
  }
]
```

### Editing About Page

Edit `content/about.md` with your personal story in Markdown format.

### Adding Life Moments

Edit `content/life.json`:

```json
[
  {
    "id": "unique-id",
    "type": "scuba",
    "title": "Title",
    "description": "Description",
    "date": "2024-01-01",
    "location": "Location"
  }
]
```

## Newsletter Integration

The platform includes an abstraction layer for newsletter providers. Currently supports:

- **Resend**: Set `NEWSLETTER_PROVIDER=resend` and provide API key
- **Mailchimp**: Set `NEWSLETTER_PROVIDER=mailchimp` and provide credentials

To add a new provider, implement the `NewsletterProvider` interface in `lib/newsletter.ts`.

## Course Platform (Future-Ready)

The course architecture is scaffolded but not fully implemented. To enable:

1. Add courses to `content/courses.json`
2. Implement payment flow using the `PaymentProvider` abstraction
3. Add access control logic
4. Set up Stripe products and prices

The structure is ready - just add the business logic when needed.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

The platform is optimized for Vercel deployment with:
- Automatic sitemap generation
- RSS feed at `/rss.xml`
- SEO metadata on all pages
- Optimized images and assets

## Customization

### Colors & Theme

Edit CSS variables in `app/globals.css`:

```css
:root {
  --color-ocean-deep: #0a1929;
  --color-teal-base: #14a085;
  /* ... */
}
```

### Typography

Update font imports in `app/layout.tsx` and CSS variables.

### Navigation

Edit `components/Navigation.tsx` to update menu items.

## SEO

- All pages include proper metadata
- OpenGraph tags for social sharing
- Automatic sitemap generation (`/sitemap.xml`)
- RSS feed for blog (`/rss.xml`)

## Performance

- Optimized images
- Static generation where possible
- Minimal JavaScript bundle
- Fast page loads

## License

Private - All rights reserved

## Support

For questions or issues, please open an issue or contact directly.


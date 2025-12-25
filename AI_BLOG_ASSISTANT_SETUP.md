# AI-Powered Blog Writing Assistant - Setup Guide

## 🎉 Feature Overview

Your portfolio now includes an AI-powered blog writing assistant that helps you:
- **Generate blog outlines** from topics
- **Improve writing** clarity and engagement
- **Optimize SEO** with suggestions and meta descriptions
- **Explain code snippets** for technical posts
- **Suggest related topics** for future content

## 🔑 Setup Instructions

### 1. Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to **API Keys** section
4. Click **"Create new secret key"**
5. Copy the API key (you won't see it again!)

### 2. Add to Environment Variables

Add your OpenAI API key to `.env.local`:

```env
OPENAI_API_KEY=sk-your-api-key-here
```

### 3. Restart Development Server

```bash
npm run dev
```

## 🚀 How to Use

### Access the AI Assistant

1. Go to `/admin/blog/new` or edit an existing post
2. Look for the **"AI Assistant"** floating button in the bottom-right corner
3. Click it to open the AI assistant panel

### Features

#### 📝 Generate Blog Outline
- Enter a topic (e.g., "Building scalable Android apps")
- Click "Generate"
- The outline will replace your current content

#### ✨ Improve Writing
- Write your content first
- Optionally specify a focus area (e.g., "clarity", "engagement")
- Click "Improve Content"
- The improved version will replace your content

#### 🔍 SEO Optimization
- Fill in title and content
- Click "Optimize SEO"
- Get suggestions, optimized meta description, and keywords
- Meta description and keywords are automatically applied

#### 📄 Generate Meta Description
- Fill in title and content
- Click "Generate Meta"
- Meta description is automatically filled in

#### 💻 Explain Code
- Paste a code snippet
- Optionally specify the language
- Click "Explain Code"
- Explanation is inserted at cursor position

#### 💡 Suggest Related Topics
- Fill in title and content
- Click "Suggest Topics"
- Get 5-7 related topic ideas for future posts

## 💰 Cost Considerations

The AI assistant uses OpenAI's `gpt-4o-mini` model, which is:
- **Very affordable** (~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens)
- **Fast** responses
- **High quality** for blog writing tasks

Typical costs per use:
- Generate Outline: ~$0.001-0.002
- Improve Writing: ~$0.002-0.005
- SEO Optimization: ~$0.001-0.002
- Other features: ~$0.001-0.002

**Estimated monthly cost**: $5-20 for regular blog writing (50-100 posts/month)

## 🔒 Security

- API key is stored in `.env.local` (never commit this file!)
- API routes are server-side only
- No API key exposure to client-side code
- All requests go through Next.js API routes

## 🛠️ Troubleshooting

### "Failed to generate outline" error
- Check that `OPENAI_API_KEY` is set in `.env.local`
- Verify the API key is valid
- Check your OpenAI account has credits
- Restart the dev server after adding the key

### Slow responses
- Normal for AI generation (2-5 seconds)
- Check your internet connection
- Verify OpenAI API status

### Rate limits
- OpenAI has rate limits based on your plan
- Free tier: 3 requests/minute
- Paid tier: Higher limits
- If you hit limits, wait a minute and try again

## 📝 Notes

- The AI assistant uses your existing content as context
- All suggestions are editable - you're in control!
- Use it as a starting point, not a replacement for your voice
- The assistant understands technical content and your writing style

## 🎨 Customization

To customize the AI prompts, edit `lib/ai.ts`:
- Adjust temperature for more/less creative responses
- Modify system prompts to match your writing style
- Change model if needed (gpt-4o-mini is recommended for cost/quality balance)



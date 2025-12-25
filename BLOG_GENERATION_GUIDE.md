# Blog Generation Guide

This guide explains how to automatically generate 50+ SEO-optimized, human-like blog posts that rank well in both traditional search engines and AI search results.

## Features

- **Human-like Writing**: Content is generated with natural variation, uneven line lengths, and authentic voice
- **SEO Optimized**: Includes meta descriptions, keywords, and structured content
- **Interactive Components**: Automatically injects code snippets, timelines, maps, stats, and location cards
- **AI Search Friendly**: Optimized for Perplexity, ChatGPT, and other AI search engines
- **Non-Detectable**: Uses advanced techniques to avoid AI detection

## Prerequisites

1. OpenAI API Key in `.env.local`:
   ```env
   OPENAI_API_KEY=your_key_here
   ```

2. (Optional) Supabase configured for database storage:
   ```env
   USE_SUPABASE=true
   NEXT_PUBLIC_SUPABASE_URL=your_url
   SUPABASE_SERVICE_ROLE_KEY=your_key
   ```

## Usage

### Generate All Blog Posts

```bash
npm run generate:blogs
```

This will:
1. Read topics from `scripts/blog-topics.json`
2. Generate 50+ blog posts with human-like content
3. Automatically inject interactive components
4. Save to Supabase (if configured) or file system
5. Add delays between posts to avoid rate limits

### Customize Topics

Edit `scripts/blog-topics.json` to add, remove, or modify topics:

```json
{
  "topics": [
    {
      "title": "Your Topic Title",
      "keywords": ["keyword1", "keyword2", "keyword3"],
      "category": "technical",
      "targetAudience": ["developers", "final-year-students"]
    }
  ]
}
```

## How It Works

### 1. Human-Like Content Generation

The script uses GPT-4o with specific prompts to generate content that:
- Has varied sentence lengths (3-30 words)
- Includes personal anecdotes and mistakes
- Uses natural contractions and casual language
- Has uneven paragraph lengths
- Includes rhetorical questions and asides
- Shows learning moments and uncertainty

### 2. Natural Variation

Content is post-processed to:
- Split long sentences naturally
- Merge short sentences occasionally
- Create uneven word counts per line
- Add natural rhythm and flow

### 3. Interactive Components

The script automatically injects components based on content:

- **CodeFromLocation**: When content mentions code/examples
- **StoryTimeline**: When content mentions steps/processes
- **JourneyMap**: When content mentions locations
- **LocationCard**: Alternative location component
- **JourneyStats**: When content mentions metrics/numbers

### 4. SEO Optimization

Each post includes:
- SEO-optimized meta description (150-160 chars)
- Relevant keywords in tags
- Proper category classification
- Structured markdown with headings

## Component Usage in Generated Posts

### Code Snippets

```mdx
<CodeFromLocation 
  location="Coffee Shop"
  date="2024-01-15"
  language="typescript"
>

\`\`\`typescript
// Your code here
\`\`\`

</CodeFromLocation>
```

### Timelines

```mdx
<StoryTimeline>

<TimelineEvent 
  date="2024-01-15"
  location="San Francisco, CA"
>
Initial research phase
</TimelineEvent>

</StoryTimeline>
```

### Maps

```mdx
<JourneyMap 
  location="Bangalore, India"
  coordinates={[12.9716, 77.5946]}
  type="work"
  date="2024-01-15"
/>
```

### Stats

```mdx
<JourneyStats 
  cities={10}
  kilometers={500}
  rides={5}
  countries={3}
/>
```

## Tips for Best Results

1. **Review Generated Content**: While the script generates human-like content, review and edit as needed
2. **Add Personal Touch**: Add your own experiences and anecdotes
3. **Update Components**: Customize component data to match your actual experiences
4. **Monitor Performance**: Track which topics perform best and generate more similar content
5. **Regular Updates**: Generate new posts regularly to maintain fresh content

## Troubleshooting

### Rate Limits

If you hit OpenAI rate limits:
- The script includes delays between posts
- Reduce the number of topics in `blog-topics.json`
- Run the script in batches

### Component Errors

If components don't render:
- Check that component syntax matches the guide
- Verify component props are correct
- Check browser console for errors

### Storage Issues

- If using file system: Check `content/blog/` directory permissions
- If using Supabase: Verify credentials and table schema

## Next Steps

1. Generate initial batch of posts
2. Review and refine content
3. Monitor SEO performance
4. Generate additional topics based on performance
5. Update components with real data from your experiences

## Support

For issues or questions:
- Check component documentation in `BLOG_COMPONENTS_GUIDE.md`
- Review topic structure in `scripts/blog-topics.json`
- Check script logs for detailed error messages


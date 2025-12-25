# Blog Writing Guide

## Quick Start

1. Create a new `.mdx` file in `/content/blog/`
2. Copy the template from `/content/blog/.template.mdx`
3. Fill in the front-matter
4. Write your content in Markdown
5. Save and refresh your site

## File Naming

Use URL-friendly names (lowercase, hyphens):

✅ Good:
- `android-architecture-patterns.mdx`
- `my-first-post.mdx`
- `scuba-diving-maldives.mdx`

❌ Avoid:
- `My First Post.mdx` (spaces, capitals)
- `post1.mdx` (not descriptive)

## Front-Matter Explained

```yaml
---
title: "Your Post Title"           # Required: Post title
description: "Preview text"       # Required: SEO & preview description
date: "2024-01-15"                # Required: Original date (YYYY-MM-DD)
publishedAt: "2024-01-15"         # Required: Publication date
tags: ["android", "kotlin"]       # Optional: Array of tags
category: "tech"                   # Optional: Category name
published: true                    # Required: true = visible, false = draft
---
```

## Categories

Suggested categories:
- `tech` - Technical posts
- `career` - Career advice, lessons
- `travel` - Travel experiences
- `life` - Personal reflections
- `general` - Everything else

## Writing Tips

### Drafts
Set `published: false` to save drafts. They won't appear on the blog page.

### Code Blocks
Use triple backticks with language identifier:

\`\`\`kotlin
fun example() {
    println("Hello")
}
\`\`\`

### Images
Store images in `/public/images/blog/` and reference them:

```markdown
![Alt text](/images/blog/my-image.jpg)
```

### Reading Time
Automatically calculated based on word count.

## Example Post Structure

```mdx
---
title: "Building Scalable Android Apps"
description: "Lessons learned from building apps that scale to millions of users"
date: "2024-01-15"
publishedAt: "2024-01-15"
tags: ["android", "kotlin", "architecture", "scalability"]
category: "tech"
published: true
---

# Building Scalable Android Apps

Introduction paragraph...

## Section 1

Content here...

## Section 2

More content...

## Conclusion

Wrap up your thoughts...
```

## Workflow

1. **Write locally**: Create `.mdx` file in `/content/blog/`
2. **Test**: Run `npm run dev` and check `/blog`
3. **Draft mode**: Use `published: false` while writing
4. **Publish**: Set `published: true` when ready
5. **Deploy**: Push to git, Vercel auto-deploys

## Advanced: MDX Features

Since we're using MDX, you can embed React components:

```mdx
import { CustomComponent } from '@/components/CustomComponent'

<CustomComponent prop="value" />
```

But for most posts, plain Markdown is perfect!




import { config } from 'dotenv'
import { resolve } from 'path'
import fs from 'fs'
import path from 'path'
import OpenAI from 'openai'
import matter from 'gray-matter'

config({ path: resolve(process.cwd(), '.env.local') })

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface BlogTopic {
  title: string
  keywords: string[]
  category: string
}

const postsToUpdate = [
  {
    title: "How to Prepare for Software Engineering Interviews in 2024",
    keywords: ["software engineering interview", "coding interview", "tech interview preparation", "FAANG interview"],
    category: "career"
  },
  {
    title: "System Design Interview Questions: Complete Guide for Beginners",
    keywords: ["system design interview", "distributed systems", "scalability", "architecture"],
    category: "technical"
  },
  {
    title: "Data Structures and Algorithms: Must-Know for Every Developer",
    keywords: ["data structures", "algorithms", "DSA", "programming fundamentals"],
    category: "technical"
  },
  {
    title: "How to Build a Full-Stack Application: Step-by-Step Guide",
    keywords: ["full-stack development", "web development", "MERN stack", "full stack tutorial"],
    category: "tutorial"
  },
  {
    title: "React vs Vue vs Angular: Which Framework Should You Learn in 2024?",
    keywords: ["React", "Vue", "Angular", "frontend framework", "JavaScript framework comparison"],
    category: "technical"
  },
  {
    title: "How to Get Your First Software Engineering Job: Complete Roadmap",
    keywords: ["first job", "software engineer job", "career roadmap", "entry level developer"],
    category: "career"
  }
]

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

async function generateHumanLikeContent(topic: BlogTopic): Promise<string> {
  const prompt = `Write a comprehensive, engaging blog post in Medium style about "${topic.title}". 

WRITING STYLE (Based on successful Medium technical articles like iamayaz):
1. **Opening Hook**: Start with a personal story, question, or relatable scenario that draws readers in immediately. Make it compelling.
2. **Conversational Tone**: Write like you're talking to a friend over coffee - natural, authentic, personal. Use "I" and "you" liberally.
3. **Story-Driven**: Weave personal experiences, failures, and successes throughout. Make it relatable. Share what you learned the hard way.
4. **Practical Focus**: Every section should provide actionable advice, not just theory. Give readers something they can use immediately.
5. **Clear Structure**: Use headings to break up content, but keep it natural - not overly formal. Use ## for main sections, ### for subsections.
6. **Real Examples**: Include specific examples, numbers, dates, and real-world scenarios. Make it concrete, not abstract.
7. **Varied Sentence Length**: Mix very short punchy sentences (3-5 words) with longer explanatory ones (15-25 words). Create rhythm.
8. **Uneven Paragraphs**: Some paragraphs are 1-2 sentences for impact, others are 4-6 for depth. Vary them significantly.
9. **Natural Language**: 
   - Use contractions (I've, don't, can't, won't) naturally
   - Start sentences with "And", "But", "So" when it feels right
   - Use sentence fragments for emphasis
   - Include rhetorical questions
   - Add asides in parentheses naturally
   - Use "like" or "you know" occasionally for authenticity
10. **Code Examples**: Include practical code snippets that readers can actually use. Use CodeFromLocation component when showing code.
11. **Step-by-Step Guides**: When explaining processes, break them into clear, actionable steps. Number them or use bullet points.
12. **Length**: 2000-3000 words - comprehensive but not overwhelming. Quality over quantity.
13. **Format**: Markdown format. Use > for blockquotes (1-2 impactful quotes per article).
14. **Blockquotes**: Include 1-2 blockquotes using > in markdown for:
    - Key insights or "aha!" moments
    - Memorable quotes or principles
    - Important takeaways that deserve emphasis
    Make them impactful and quotable.
15. **Personality**: Show your personality - excitement, frustration, humor, doubt. Be human. Don't be afraid to show vulnerability.
16. **Ending**: Conclude with encouragement, key takeaways, or a call to action. Leave readers feeling motivated.

STRUCTURE:
- Strong opening hook (personal story or question)
- Problem/context setting
- Your journey/experience
- Practical advice with examples
- Common mistakes to avoid
- Resources/tools
- Encouraging conclusion

Keywords to naturally incorporate: ${topic.keywords.join(', ')}

Write in Medium style - engaging, personal, practical, and authentic. Make readers feel like they're learning from a real person who's been there.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an experienced software engineer who writes popular Medium articles. Your writing style is: conversational, personal, story-driven, and practical. You share real experiences, failures, and successes. You write like you\'re talking to a friend - authentic, relatable, and engaging. Your articles have strong opening hooks, practical advice, and encouraging conclusions. You make complex topics accessible without dumbing them down.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.9,
      max_tokens: 4000,
      presence_penalty: 0.6,
      frequency_penalty: 0.5
    })

    let content = completion.choices[0]?.message?.content || ''
    
    return content
  } catch (error) {
    console.error(`Error generating content for ${topic.title}:`, error)
    throw error
  }
}

async function generateMetaDescription(title: string, content: string): Promise<string> {
  const prompt = `Generate a compelling, SEO-optimized meta description (150-160 characters) for this blog post:

Title: ${title}
Content preview: ${content.substring(0, 500)}...

Make it engaging, include key terms, and encourage clicks.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an SEO expert who writes compelling meta descriptions.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 200
    })

    return completion.choices[0]?.message?.content?.trim() || ''
  } catch (error) {
    console.error('Error generating meta description:', error)
    return ''
  }
}

async function updateBlogPost(topic: BlogTopic, index: number, total: number): Promise<void> {
  console.log(`\n[${index + 1}/${total}] Updating: ${topic.title}`)
  
  const slug = generateSlug(topic.title)
  const postsDir = path.join(process.cwd(), 'content', 'blog')
  const filePath = path.join(postsDir, `${slug}.mdx`)
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`)
    return
  }
  
  // Read existing file to preserve date
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data } = matter(fileContents)
  
  // Generate new content
  const content = await generateHumanLikeContent(topic)
  const description = await generateMetaDescription(topic.title, content)
  
  // Preserve original date or use existing
  const date = data.date || data.publishedAt || new Date().toISOString()
  const publishedAt = data.publishedAt || data.date || date
  
  const frontmatter = `---
title: "${topic.title}"
description: "${description.replace(/"/g, '\\"')}"
date: "${date}"
publishedAt: "${publishedAt}"
tags: ${JSON.stringify([...topic.keywords, topic.category])}
category: "${topic.category}"
published: ${data.published !== false}
---

${content}
`
  
  fs.writeFileSync(filePath, frontmatter, 'utf8')
  console.log(`✓ Updated: ${slug}.mdx`)
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY not found in .env.local')
    process.exit(1)
  }
  
  console.log(`\n🚀 Starting blog update...`)
  console.log(`📝 Posts to update: ${postsToUpdate.length}\n`)
  
  const errors: Array<{ topic: string; error: string }> = []
  
  for (let i = 0; i < postsToUpdate.length; i++) {
    try {
      await updateBlogPost(postsToUpdate[i], i, postsToUpdate.length)
      
      const delay = Math.floor(Math.random() * 3000) + 2000
      console.log(`⏳ Waiting ${delay}ms before next post...`)
      await new Promise(resolve => setTimeout(resolve, delay))
    } catch (error: any) {
      console.error(`❌ Error with ${postsToUpdate[i].title}:`, error.message)
      errors.push({ topic: postsToUpdate[i].title, error: error.message })
    }
  }
  
  console.log(`\n\n✅ Update complete!`)
  console.log(`📊 Updated: ${postsToUpdate.length - errors.length}/${postsToUpdate.length}`)
  console.log(`❌ Errors: ${errors.length}`)
  
  if (errors.length > 0) {
    console.log(`\n⚠️  Errors:`)
    errors.forEach(({ topic, error }) => {
      console.log(`   - ${topic}: ${error}`)
    })
  }
}

main().catch(console.error)


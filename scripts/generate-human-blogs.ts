import { config } from 'dotenv'
import { resolve } from 'path'
import fs from 'fs'
import path from 'path'
import OpenAI from 'openai'

const topicsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'blog-topics.json'), 'utf8')
)

config({ path: resolve(process.cwd(), '.env.local') })

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface BlogTopic {
  title: string
  keywords: string[]
  category: string
  targetAudience: string[]
}

interface GeneratedPost {
  title: string
  slug: string
  description: string
  content: string
  tags: string[]
  category: string
  published: boolean
  date: string
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function addNaturalVariation(text: string): string {
  const paragraphs = text.split(/\n\n+/)
  const variedParagraphs: string[] = []
  
  for (const para of paragraphs) {
    if (para.trim().length === 0 || para.startsWith('<') || para.startsWith('#')) {
      variedParagraphs.push(para)
      continue
    }
    
    const sentences = para.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const variedSentences: string[] = []
    
    for (let i = 0; i < sentences.length; i++) {
      let sentence = sentences[i].trim()
      if (!sentence) continue
      
      const words = sentence.split(' ')
      const wordCount = words.length
      
      if (wordCount > 0) {
        const variation = Math.random()
        
        if (variation < 0.15 && wordCount > 12) {
          const splitPoint = Math.floor(Math.random() * (wordCount - 6) + 4)
          const firstPart = words.slice(0, splitPoint).join(' ')
          const secondPart = words.slice(splitPoint).join(' ')
          variedSentences.push(firstPart + '.')
          variedSentences.push(secondPart.charAt(0).toUpperCase() + secondPart.slice(1))
        } else if (variation < 0.25 && wordCount < 8 && i < sentences.length - 1) {
          const nextSentence = sentences[i + 1]?.trim() || ''
          if (nextSentence) {
            const nextWords = nextSentence.split(' ')
            const mergeCount = Math.min(3, Math.floor(nextWords.length / 2))
            sentence = sentence + ' ' + nextWords.slice(0, mergeCount).join(' ')
            i++
          }
          variedSentences.push(sentence + '.')
        } else {
          variedSentences.push(sentence + (sentence.match(/[.!?]$/) ? '' : '.'))
        }
      }
    }
    
    const variedPara = variedSentences.join(' ')
    variedParagraphs.push(variedPara)
  }
  
  return variedParagraphs.join('\n\n')
}

function injectInteractiveComponents(content: string, topic: BlogTopic): string {
  const sections = content.split(/\n\n+/)
  let componentCount = 0
  const maxComponents = Math.min(3, Math.floor(sections.length / 3))
  
  const usedTypes = new Set<string>()
  
  for (let i = 0; i < sections.length && componentCount < maxComponents; i++) {
    const section = sections[i]
    const sectionLower = section.toLowerCase()
    
    let component: string | null = null
    let componentType: string | null = null
    
    if ((sectionLower.includes('code') || sectionLower.includes('example') || sectionLower.includes('implementation') || sectionLower.includes('function') || sectionLower.includes('algorithm')) && !usedTypes.has('code')) {
      component = generateCodeComponent(topic)
      componentType = 'code'
    } else if ((sectionLower.includes('step') || sectionLower.includes('process') || sectionLower.includes('journey') || sectionLower.includes('learned') || sectionLower.includes('timeline') || sectionLower.includes('phase')) && !usedTypes.has('timeline')) {
      component = generateTimelineComponent(topic)
      componentType = 'timeline'
    }
    
    if (component && componentType) {
      sections.splice(i + 1, 0, '\n' + component + '\n')
      usedTypes.add(componentType)
      componentCount++
      i++
    }
  }
  
  return sections.join('\n\n')
}

function generateCodeComponent(topic: BlogTopic): string {
  const languages = ['javascript', 'typescript', 'python', 'java', 'go', 'rust']
  const language = languages[Math.floor(Math.random() * languages.length)]
  
  const locations = [
    'Local Coffee Shop',
    'Home Office',
    'Co-working Space',
    'Library',
    'Park Bench',
    'Airport Lounge'
  ]
  const location = locations[Math.floor(Math.random() * locations.length)]
  const date = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  
  const codeExamples: Record<string, string> = {
    javascript: `function ${topic.title.toLowerCase().replace(/[^a-z]+/g, '')}() {
  // Practical implementation
  const result = processData();
  return result;
}`,
    typescript: `interface ${topic.title.split(' ')[0]}Config {
  enabled: boolean;
  options: string[];
}

function ${topic.title.toLowerCase().replace(/[^a-z]+/g, '')}(config: ${topic.title.split(' ')[0]}Config) {
  return config.enabled ? process(config.options) : null;
}`,
    python: `def ${topic.title.toLowerCase().replace(/[^a-z]+/g, '_')}():
    """${topic.title} implementation"""
    result = process_data()
    return result`,
    java: `public class ${topic.title.split(' ')[0]} {
    public void ${topic.title.toLowerCase().replace(/[^a-z]+/g, '')}() {
        // Implementation
    }
}`,
    go: `func ${topic.title.toLowerCase().replace(/[^a-z]+/g, '')}() error {
    // Implementation
    return nil
}`,
    rust: `fn ${topic.title.toLowerCase().replace(/[^a-z]+/g, '_')}() -> Result<(), Error> {
    // Implementation
    Ok(())
}`
  }
  
  return `<CodeFromLocation 
  location="${location}"
  date="${date}"
  language="${language}"
>

\`\`\`${language}
${codeExamples[language]}
\`\`\`

</CodeFromLocation>`
}

function generateTimelineComponent(topic: BlogTopic): string {
  const locations = [
    'San Francisco, CA',
    'Bangalore, India',
    'Remote Workspace',
    'Home Office',
    'Coffee Shop',
    'Co-working Space'
  ]
  
  const steps = [
    'Initial Research',
    'Setting Up Environment',
    'First Implementation',
    'Testing Phase',
    'Optimization',
    'Deployment'
  ]
  
  const selectedSteps = steps.slice(0, Math.floor(Math.random() * 3) + 3)
  const events = selectedSteps.map((step, index) => ({
    location: locations[Math.floor(Math.random() * locations.length)],
    description: step,
    date: new Date(Date.now() - (selectedSteps.length - index) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  }))
  
  return `<StoryTimeline>

${events.map(event => `<TimelineEvent 
  date="${event.date}"
  location="${event.location}"
>
${event.description}
</TimelineEvent>`).join('\n\n')}

</StoryTimeline>`
}


async function generateHumanLikeContent(topic: BlogTopic): Promise<string> {
  const prompt = `Write a comprehensive, engaging blog post about "${topic.title}". 

CRITICAL REQUIREMENTS FOR HUMAN-LIKE WRITING:
1. Write in a natural, conversational style - like a real developer sharing their experience
2. Use EXTREMELY varied sentence lengths - mix very short (3-5 words) with medium (10-15) and long (20-30 words)
3. Make paragraph lengths UNEVEN - some 1-2 sentences, others 5-7 sentences
4. Include personal anecdotes, mistakes, and "aha!" moments
5. Add natural pauses, asides, and casual observations in parentheses
6. Use contractions naturally (I've, we're, don't, can't, won't, etc.)
7. Include some imperfect grammar that feels human:
   - Occasional run-on sentences for emphasis
   - Sentence fragments for dramatic effect
   - Starting sentences with "And" or "But" occasionally
   - Using "like" or "you know" naturally
8. Vary paragraph lengths SIGNIFICANTLY - some paragraphs should be 1 sentence, others 8-10
9. Include code examples, practical tips, and step-by-step guidance
10. Make it 1800-2800 words
11. Write in markdown format with proper headings (##, ###)
12. Include sections that naturally lead to:
    - Code examples (use phrases like "here's the code", "let me show you", "here's what I did")
    - Timelines (use phrases like "here's how I learned", "my journey", "step by step")
    - Location content (use phrases like "I was working from", "this happened when I was at")
    - Stats/metrics (use phrases like "here are the numbers", "after X hours", "I tracked")
13. Use natural transitions - avoid formulaic patterns
14. Include uncertainty and learning moments ("I struggled with...", "took me a while to realize...", "I made this mistake...")
15. Add personality - some humor, frustration, excitement
16. Make word count per line UNEVEN - don't make it uniform
17. Use varied punctuation - some sentences end with !, some with ..., some with ?
18. Include rhetorical questions naturally
19. Use "I" and "you" naturally - make it personal
20. Include specific numbers, dates, and details that feel real

Keywords to naturally incorporate (don't force them): ${topic.keywords.join(', ')}

Write the content now, making it feel like a real person wrote it, not an AI. The writing should have natural rhythm and flow, with uneven pacing.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an experienced software engineer and technical writer. You write in a natural, conversational style with personality. Your writing feels human and authentic, not AI-generated. You share real experiences, struggles, and insights.'
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
    
    content = addNaturalVariation(content)
    content = injectInteractiveComponents(content, topic)
    
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

async function generateBlogPost(topic: BlogTopic, index: number, total: number): Promise<GeneratedPost> {
  console.log(`\n[${index + 1}/${total}] Generating: ${topic.title}`)
  
  const slug = generateSlug(topic.title)
  const content = await generateHumanLikeContent(topic)
  const description = await generateMetaDescription(topic.title, content)
  
  const date = new Date()
  date.setDate(date.getDate() - (total - index))
  
  return {
    title: topic.title,
    slug,
    description,
    content,
    tags: [...topic.keywords, topic.category],
    category: topic.category,
    published: true,
    date: date.toISOString()
  }
}

async function saveBlogPost(post: GeneratedPost, useSupabase: boolean = false): Promise<void> {
  if (useSupabase) {
    const { createClient } = require('@supabase/supabase-js')
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not found')
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    const { error } = await supabase
      .from('blog_posts')
      .insert({
        slug: post.slug,
        title: post.title,
        description: post.description,
        content: post.content,
        tags: post.tags,
        category: post.category,
        published: post.published,
        published_at: post.date,
        date: post.date
      })
    
    if (error) {
      throw error
    }
    
    console.log(`✓ Saved to Supabase: ${post.slug}`)
  } else {
    const postsDir = path.join(process.cwd(), 'content', 'blog')
    if (!fs.existsSync(postsDir)) {
      fs.mkdirSync(postsDir, { recursive: true })
    }
    
    const frontmatter = `---
title: "${post.title}"
description: "${post.description}"
date: "${post.date}"
tags: ${JSON.stringify(post.tags)}
category: "${post.category}"
published: ${post.published}
---

${post.content}
`
    
    const filePath = path.join(postsDir, `${post.slug}.mdx`)
    fs.writeFileSync(filePath, frontmatter, 'utf8')
    console.log(`✓ Saved to file: ${post.slug}.mdx`)
  }
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY not found in .env.local')
    process.exit(1)
  }
  
  const topics = topicsData.topics as BlogTopic[]
  const useSupabase = process.env.USE_SUPABASE === 'true'
  
  console.log(`\n🚀 Starting blog generation...`)
  console.log(`📝 Topics to generate: ${topics.length}`)
  console.log(`💾 Storage: ${useSupabase ? 'Supabase' : 'File system'}\n`)
  
  const generated: GeneratedPost[] = []
  const errors: Array<{ topic: string; error: string }> = []
  
  for (let i = 0; i < topics.length; i++) {
    try {
      const post = await generateBlogPost(topics[i], i, topics.length)
      await saveBlogPost(post, useSupabase)
      generated.push(post)
      
      const delay = Math.floor(Math.random() * 3000) + 2000
      console.log(`⏳ Waiting ${delay}ms before next post...`)
      await new Promise(resolve => setTimeout(resolve, delay))
    } catch (error: any) {
      console.error(`❌ Error with ${topics[i].title}:`, error.message)
      errors.push({ topic: topics[i].title, error: error.message })
    }
  }
  
  console.log(`\n\n✅ Generation complete!`)
  console.log(`📊 Generated: ${generated.length}/${topics.length}`)
  console.log(`❌ Errors: ${errors.length}`)
  
  if (errors.length > 0) {
    console.log(`\n⚠️  Errors:`)
    errors.forEach(({ topic, error }) => {
      console.log(`   - ${topic}: ${error}`)
    })
  }
}

main().catch(console.error)


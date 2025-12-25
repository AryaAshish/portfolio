import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'
import OpenAI from 'openai'
import readingTime from 'reading-time'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const openaiKey = process.env.OPENAI_API_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials in .env.local')
}

if (!openaiKey) {
  throw new Error('Missing OPENAI_API_KEY in .env.local')
}

const supabase = createClient(supabaseUrl, supabaseKey)
const openai = new OpenAI({ apiKey: openaiKey })

interface BlogPost {
  slug: string
  title: string
  description: string
  content: string
  tags: string[]
  category: string
  published: boolean
  published_at: string
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

async function generateMediumStyleBlog(
  question: string,
  shortAnswer: string,
  topic: string,
  tags: string[]
): Promise<string> {
  const prompt = `Write a comprehensive, engaging blog post in Medium style about "${question}".

CONTEXT:
- This is part of an Android Development Interview Prep series
- Topic: ${topic}
- Short answer preview: ${shortAnswer}
- Tags: ${tags.join(', ')}

WRITING STYLE (Based on successful Medium technical articles):
1. **Opening Hook**: Start with a personal story, question, or relatable scenario. Maybe a time you struggled with this in an interview, or a real-world problem you faced.
2. **Conversational Tone**: Write like you're talking to a friend - natural, authentic, personal. Use "I" and "you" liberally.
3. **Story-Driven**: Weave personal experiences, failures, and successes. Share what you learned the hard way.
4. **Practical Focus**: Every section should provide actionable advice with real code examples. Give readers something they can use immediately.
5. **Clear Structure**: Use ## for main sections, ### for subsections. Keep it natural, not overly formal.
6. **Real Examples**: Include specific Android/Kotlin code examples, real-world scenarios, and practical implementations.
7. **Varied Sentence Length**: Mix very short punchy sentences (3-5 words) with longer explanatory ones (15-25 words).
8. **Uneven Paragraphs**: Some paragraphs are 1-2 sentences for impact, others are 4-6 for depth.
9. **Natural Language**: 
   - Use contractions (I've, don't, can't, won't) naturally
   - Start sentences with "And", "But", "So" when it feels right
   - Use sentence fragments for emphasis
   - Include rhetorical questions
   - Add asides in parentheses naturally
10. **Code Examples**: Include practical Kotlin/Android code snippets. Use proper code blocks with language tags.
11. **Step-by-Step Guides**: When explaining processes, break them into clear, actionable steps.
12. **Length**: 2000-3000 words - comprehensive but not overwhelming.
13. **Format**: Markdown format. Use > for blockquotes (1-2 impactful quotes per article).
14. **Blockquotes**: Include 1-2 blockquotes for key insights or "aha!" moments.
15. **Personality**: Show your personality - excitement, frustration, humor, doubt. Be human.
16. **Ending**: Conclude with encouragement, key takeaways, or a call to action.

STRUCTURE:
- Strong opening hook (personal story or question)
- Problem/context setting
- Your journey/experience with this topic
- Deep dive explanation with code examples
- Common mistakes to avoid
- Best practices and tips
- Real-world examples
- Encouraging conclusion

Make it comprehensive, practical, and engaging. Write like you're helping a friend prepare for their Android interview.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an experienced Android developer who writes popular Medium articles. Your writing style is: conversational, personal, story-driven, and practical. You share real experiences, failures, and successes. You write like you\'re talking to a friend - authentic, relatable, and engaging. Your articles have strong opening hooks, practical Android/Kotlin code examples, and encouraging conclusions. You make complex Android topics accessible without dumbing them down.'
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

    return completion.choices[0]?.message?.content || ''
  } catch (error) {
    console.error(`Error generating blog for "${question}":`, error)
    throw error
  }
}

async function generateMetaDescription(title: string, content: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an SEO expert. Generate concise, compelling meta descriptions (150-160 characters) for blog posts that are optimized for search engines and encourage clicks.'
        },
        {
          role: 'user',
          content: `Generate a meta description for this blog post:\n\nTitle: ${title}\n\nContent preview: ${content.substring(0, 500)}...`
        }
      ],
      temperature: 0.7,
      max_tokens: 200
    })

    return completion.choices[0]?.message?.content?.trim() || ''
  } catch (error) {
    console.error('Error generating meta description:', error)
    return `${title}. Learn Android development concepts with practical examples and best practices.`
  }
}

async function createBlogPost(question: any, topicTitle: string): Promise<string | null> {
  const title = question.question.replace('?', '').replace('Explain ', '').replace('What is ', '').replace('How do you ', '')
  const slug = generateSlug(title)
  
  console.log(`\n📝 Creating blog post: "${title}"`)
  console.log(`   Topic: ${topicTitle}`)
  console.log(`   Slug: ${slug}`)

  try {
    // Check if blog post already exists
    const { data: existing } = await supabase
      .from('blog_posts')
      .select('slug')
      .eq('slug', slug)
      .single()

    if (existing) {
      console.log(`   ⚠️  Blog post already exists, using existing: ${slug}`)
      return slug
    }

    // Generate content
    console.log(`   🤖 Generating content...`)
    const content = await generateBlogPost(question, topicTitle)
    
    if (!content || content.length < 500) {
      console.log(`   ❌ Generated content too short, skipping`)
      return null
    }

    // Generate meta description
    const description = await generateMetaDescription(title, content)
    
    // Calculate reading time
    const readingTimeResult = readingTime(content)
    const readingTimeMinutes = Math.ceil(readingTimeResult.minutes)

    // Prepare tags
    const tags = [...question.tags, 'android', 'interview-prep', topicTitle.toLowerCase().replace(/\s+/g, '-')]

    // Create blog post
    const { data: blogPost, error } = await supabase
      .from('blog_posts')
      .insert({
        slug,
        title,
        description,
        content,
        tags: Array.from(new Set(tags)),
        category: 'tech',
        published: true,
        published_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error(`   ❌ Error creating blog post:`, error)
      return null
    }

    console.log(`   ✅ Blog post created successfully!`)
    console.log(`   📊 Reading time: ${readingTimeMinutes} min`)
    
    return slug
  } catch (error) {
    console.error(`   ❌ Error:`, error)
    return null
  }
}

async function generateBlogPost(question: any, topicTitle: string): Promise<string> {
  const shortAnswer = question.answer ? question.answer.substring(0, 300) : ''
  
  return await generateMediumStyleBlog(
    question.question,
    shortAnswer,
    topicTitle,
    question.tags || []
  )
}

async function linkBlogToQuestion(questionId: string, blogSlug: string) {
  const { error } = await supabase
    .from('prep_questions')
    .update({ related_blog_post: blogSlug })
    .eq('id', questionId)

  if (error) {
    console.error(`   ❌ Error linking blog to question:`, error)
  } else {
    console.log(`   🔗 Linked blog post to question`)
  }
}

async function createAndroidBlogPosts() {
  try {
    console.log('🚀 Starting Android blog post creation...\n')

    // Get Android prep path ID first
    const { data: paths } = await supabase
      .from('prep_paths')
      .select('id')
      .eq('category', 'android')
      .single()

    if (!paths) {
      console.log('No Android prep path found')
      return
    }

    // Get all topics for Android prep path
    const { data: topics } = await supabase
      .from('prep_topics')
      .select('id, title, order')
      .eq('prep_path_id', paths.id)
      .order('order', { ascending: true })

    if (!topics || topics.length === 0) {
      console.log('No topics found')
      return
    }

    // Get all questions for these topics
    const topicIds = topics.map(t => t.id)
    const { data: questions, error } = await supabase
      .from('prep_questions')
      .select('id, question, answer, difficulty, tags, related_blog_post, prep_topic_id, order')
      .in('prep_topic_id', topicIds)
      .order('order', { ascending: true })

    if (error) {
      throw error
    }

    if (!questions || questions.length === 0) {
      console.log('No questions found')
      return
    }

    console.log(`Found ${questions.length} questions\n`)

    // Filter for deep topics (long answers, code blocks, or multiple paragraphs)
    const deepTopics = questions.filter((q: any) => {
      if (!q.answer) return false
      const answerLength = q.answer.length
      const hasCodeBlocks = q.answer.includes('```') || q.answer.includes('`')
      const hasMultipleParagraphs = q.answer.split('\n\n').length > 2
      return answerLength > 500 || hasCodeBlocks || hasMultipleParagraphs
    })

    console.log(`📚 Creating blog posts for ${deepTopics.length} deep topics...\n`)

    // Create a map of topic IDs to titles
    const topicMap = new Map(topics.map(t => [t.id, t.title]))

    // Create blog posts for deep topics
    for (let i = 0; i < deepTopics.length; i++) {
      const question = deepTopics[i]
      const topicTitle = topicMap.get(question.prep_topic_id) || 'Android Development'
      
      // Skip if already has a blog post
      if (question.related_blog_post) {
        console.log(`\n⏭️  Skipping "${question.question}" - already has blog post`)
        continue
      }

      const blogSlug = await createBlogPost(question, topicTitle)
      
      if (blogSlug) {
        await linkBlogToQuestion(question.id, blogSlug)
      }

      // Add delay to avoid rate limits
      if (i < deepTopics.length - 1) {
        console.log(`   ⏳ Waiting 3 seconds before next post...`)
        await new Promise(resolve => setTimeout(resolve, 3000))
      }
    }

    console.log('\n✅ Blog post creation complete!')
  } catch (error) {
    console.error('❌ Error creating blog posts:', error)
    throw error
  }
}

createAndroidBlogPosts()
  .then(() => {
    console.log('\n🎉 Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Failed:', error)
    process.exit(1)
  })


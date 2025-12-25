import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'
import readingTime from 'reading-time'
import * as fs from 'fs'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials in .env.local')
}

const supabase = createClient(supabaseUrl, supabaseKey)

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Read the Activity Lifecycle blog from file and migrate it
async function migrateActivityLifecycleBlog() {
  const filePath = path.join(process.cwd(), 'content', 'blog', 'android-activity-lifecycle-complete-guide.mdx')
  
  if (!fs.existsSync(filePath)) {
    console.log('Activity Lifecycle blog file not found, skipping...')
    return null
  }

  const content = fs.readFileSync(filePath, 'utf8')
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  
  if (!frontmatterMatch) {
    console.log('Could not parse frontmatter')
    return null
  }

  const frontmatter = frontmatterMatch[1]
  const blogContent = frontmatterMatch[2]
  
  const titleMatch = frontmatter.match(/title:\s*"([^"]+)"/)
  const descMatch = frontmatter.match(/description:\s*"([^"]+)"/)
  const tagsMatch = frontmatter.match(/tags:\s*\[([^\]]+)\]/)
  
  const title = titleMatch ? titleMatch[1] : 'Android Activity Lifecycle'
  const description = descMatch ? descMatch[1] : 'Complete guide to Android Activity lifecycle'
  const tags = tagsMatch ? tagsMatch[1].split(',').map(t => t.trim().replace(/"/g, '')) : ['android', 'kotlin']
  
  const slug = generateSlug(title)
  
  // Check if exists
  const { data: existing } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('slug', slug)
    .single()

  if (existing) {
    console.log(`✅ Activity Lifecycle blog already exists: ${slug}`)
    return slug
  }

  // Create blog post
  const { error } = await supabase
    .from('blog_posts')
    .insert({
      slug,
      title,
      description,
      content: blogContent,
      tags: Array.from(new Set([...tags, 'android', 'interview-prep'])),
      category: 'tech',
      published: true,
      published_at: new Date().toISOString(),
    })

  if (error) {
    console.error('Error creating Activity Lifecycle blog:', error)
    return null
  }

  console.log(`✅ Created Activity Lifecycle blog: ${slug}`)
  return slug
}

// Generate blog post content based on question
function generateBlogContent(question: string, shortAnswer: string, topic: string, tags: string[]): { title: string; description: string; content: string } {
  // Extract a clean title from the question
  let title = question
    .replace(/^Explain\s+/i, '')
    .replace(/^What is\s+/i, '')
    .replace(/^How do you\s+/i, '')
    .replace(/\?$/, '')
    .trim()
  
  // Capitalize first letter
  title = title.charAt(0).toUpperCase() + title.slice(1)
  
  // Generate description
  const description = `${title}. Learn everything you need to know about this Android development concept with practical examples, code snippets, and real-world scenarios.`
  
  // Generate comprehensive content in Medium style
  const content = `# ${title}

I remember the first time I was asked about ${title.toLowerCase()} in an interview. I thought I knew it well—until the interviewer started digging deeper.

"What happens when..." they asked. "How would you handle..." they probed.

That's when I realized: knowing the basics isn't enough. You need to understand the *why*, the *when*, and the *how*.

Let me share everything I've learned about ${title.toLowerCase()}—the mistakes I made, the lessons I learned, and the best practices that'll help you ace your interviews and build better Android apps.

## Understanding the Basics

${shortAnswer.substring(0, 200)}...

But there's so much more to it than that.

## Deep Dive

Let's break this down step by step.

### What It Is

${title} is a fundamental concept in Android development that every developer should understand deeply.

### Why It Matters

Understanding ${title.toLowerCase()} is crucial because:

1. **Interview Success**: This is a common interview topic
2. **Better Code**: Understanding this leads to better architecture decisions
3. **Performance**: Proper implementation improves app performance
4. **Maintainability**: Clear understanding makes code easier to maintain

### How It Works

Here's a practical example:

\`\`\`kotlin
// Example implementation
class Example {
    fun demonstrate() {
        // Practical code example
    }
}
\`\`\`

## Common Mistakes

I've seen developers make these mistakes:

1. **Mistake 1**: Not understanding the full picture
2. **Mistake 2**: Implementing without considering edge cases
3. **Mistake 3**: Not following best practices

## Best Practices

Here's what I've learned:

1. Always consider edge cases
2. Follow Android best practices
3. Test thoroughly
4. Keep code simple and readable

## Real-World Example

In one of my projects, I had to implement ${title.toLowerCase()}. Here's what I learned:

> The key to mastering ${title.toLowerCase()} is understanding not just what it does, but why it exists and when to use it.

## Key Takeaways

- ${title} is essential for Android development
- Understanding it deeply helps in interviews
- Proper implementation improves app quality
- Always follow best practices

## What's Next?

Now that you understand ${title.toLowerCase()}, you're ready to:
- Apply it in your projects
- Answer interview questions confidently
- Build better Android apps

Keep learning, keep building, and good luck with your Android journey! 🚀`

  return { title, description, content }
}

async function createBlogPost(questionId: string, question: string, shortAnswer: string, topicTitle: string, tags: string[]) {
  const blogData = generateBlogContent(question, shortAnswer, topicTitle, tags)
  const slug = generateSlug(blogData.title)
  
  console.log(`\n📝 Creating blog post: "${blogData.title}"`)
  console.log(`   Slug: ${slug}`)

  try {
    // Check if blog post already exists
    const { data: existing } = await supabase
      .from('blog_posts')
      .select('slug')
      .eq('slug', slug)
      .single()

    if (existing) {
      console.log(`   ✅ Blog post already exists: ${slug}`)
      return slug
    }

    // Create blog post
    const { error } = await supabase
      .from('blog_posts')
      .insert({
        slug,
        title: blogData.title,
        description: blogData.description,
        content: blogData.content,
        tags: Array.from(new Set([...tags, 'android', 'interview-prep', topicTitle.toLowerCase().replace(/\s+/g, '-')])),
        category: 'tech',
        published: true,
        published_at: new Date().toISOString(),
      })

    if (error) {
      console.error(`   ❌ Error creating blog post:`, error)
      return null
    }

    console.log(`   ✅ Blog post created successfully!`)
    
    return slug
  } catch (error) {
    console.error(`   ❌ Error:`, error)
    return null
  }
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

async function createAllBlogPosts() {
  try {
    console.log('🚀 Starting Android blog post creation...\n')

    // First, migrate the Activity Lifecycle blog if it exists
    await migrateActivityLifecycleBlog()

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

      // Special handling for Activity Lifecycle (use existing blog)
      if (question.id === 'c939cecd-3d6e-40a7-b79c-b37a85282bf6') {
        const activitySlug = await migrateActivityLifecycleBlog()
        if (activitySlug) {
          await linkBlogToQuestion(question.id, activitySlug)
        }
        continue
      }

      const shortAnswer = question.answer ? question.answer.substring(0, 300) : ''
      const blogSlug = await createBlogPost(question.id, question.question, shortAnswer, topicTitle, question.tags || [])
      
      if (blogSlug) {
        await linkBlogToQuestion(question.id, blogSlug)
      }

      // Small delay to avoid overwhelming the database
      if (i < deepTopics.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }

    console.log('\n✅ Blog post creation complete!')
  } catch (error) {
    console.error('❌ Error creating blog posts:', error)
    throw error
  }
}

createAllBlogPosts()
  .then(() => {
    console.log('\n🎉 Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Failed:', error)
    process.exit(1)
  })


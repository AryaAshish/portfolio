import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface AIBlogSuggestion {
  type: 'outline' | 'improve' | 'seo' | 'meta' | 'explain' | 'topics'
  content: string
  original?: string
}

export async function generateBlogOutline(topic: string, style?: string): Promise<string> {
  const prompt = `You are a technical blog writing assistant. Generate a detailed blog post outline for the topic: "${topic}".

${style ? `Writing style: ${style}` : 'Writing style: Professional, clear, and engaging. Focus on practical insights and real-world examples.'}

The outline should include:
1. A compelling title
2. A brief introduction (2-3 sentences)
3. Main sections with sub-points
4. Key takeaways or conclusion

Format the response as a structured outline with clear headings and bullet points.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert technical blog writer specializing in software engineering, mobile development, backend systems, and travel/tech storytelling.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    return completion.choices[0]?.message?.content || 'Failed to generate outline'
  } catch (error) {
    console.error('Error generating blog outline:', error)
    throw new Error('Failed to generate blog outline')
  }
}

export async function improveWriting(content: string, focus?: string): Promise<string> {
  const prompt = `Improve the following blog post content. Make it more engaging, clear, and professional.

${focus ? `Focus on: ${focus}` : 'Focus on: Clarity, flow, engagement, and technical accuracy.'}

Original content:
${content}

Provide the improved version with explanations of key changes.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert editor specializing in technical blog writing. Improve clarity, engagement, and flow while maintaining the author\'s voice.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.5,
      max_tokens: 2000,
    })

    return completion.choices[0]?.message?.content || content
  } catch (error) {
    console.error('Error improving writing:', error)
    throw new Error('Failed to improve writing')
  }
}

export async function optimizeSEO(title: string, content: string): Promise<{
  suggestions: string[]
  metaDescription: string
  keywords: string[]
}> {
  const prompt = `Analyze this blog post for SEO optimization:

Title: ${title}
Content: ${content.substring(0, 2000)}

Provide:
1. A list of 5-7 SEO improvement suggestions
2. An optimized meta description (150-160 characters)
3. Suggested keywords (5-8 relevant keywords)

Format as JSON:
{
  "suggestions": ["suggestion1", "suggestion2", ...],
  "metaDescription": "optimized meta description",
  "keywords": ["keyword1", "keyword2", ...]
}`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an SEO expert specializing in technical blog content. Provide actionable SEO recommendations.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 800,
      response_format: { type: 'json_object' },
    })

    const result = JSON.parse(completion.choices[0]?.message?.content || '{}')
    return {
      suggestions: result.suggestions || [],
      metaDescription: result.metaDescription || '',
      keywords: result.keywords || [],
    }
  } catch (error) {
    console.error('Error optimizing SEO:', error)
    throw new Error('Failed to optimize SEO')
  }
}

export async function generateMetaDescription(title: string, content: string): Promise<string> {
  const prompt = `Generate a compelling meta description (150-160 characters) for this blog post:

Title: ${title}
Content: ${content.substring(0, 1000)}

The meta description should:
- Be engaging and click-worthy
- Include relevant keywords naturally
- Accurately represent the content
- Be exactly 150-160 characters`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at writing compelling meta descriptions for technical blog posts.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.5,
      max_tokens: 200,
    })

    return completion.choices[0]?.message?.content?.trim() || ''
  } catch (error) {
    console.error('Error generating meta description:', error)
    throw new Error('Failed to generate meta description')
  }
}

export async function explainCodeSnippet(code: string, language?: string): Promise<string> {
  const prompt = `Explain this code snippet in a clear, educational way suitable for a technical blog post:

${language ? `Language: ${language}` : ''}

Code:
\`\`\`${language || ''}
${code}
\`\`\`

Provide:
1. What the code does
2. Key concepts/patterns used
3. Why it's written this way
4. Any important considerations

Keep it concise but informative.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert technical writer who explains code clearly and concisely for blog posts.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
    })

    return completion.choices[0]?.message?.content || 'Failed to explain code'
  } catch (error) {
    console.error('Error explaining code:', error)
    throw new Error('Failed to explain code')
  }
}

export async function suggestRelatedTopics(title: string, content: string, existingTopics: string[]): Promise<string[]> {
  const prompt = `Based on this blog post, suggest 5-7 related topics that would make good follow-up posts:

Title: ${title}
Content: ${content.substring(0, 1500)}
Existing topics: ${existingTopics.join(', ') || 'None'}

Suggest topics that:
- Are naturally related to this content
- Would provide value to readers
- Are different from existing topics
- Could be standalone blog posts

Return only a JSON array of topic titles.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at identifying related topics for technical blog content.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
      response_format: { type: 'json_object' },
    })

    const result = JSON.parse(completion.choices[0]?.message?.content || '{"topics": []}')
    return result.topics || []
  } catch (error) {
    console.error('Error suggesting topics:', error)
    throw new Error('Failed to suggest topics')
  }
}



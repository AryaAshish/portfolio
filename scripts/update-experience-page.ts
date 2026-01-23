import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables FIRST
config({ path: resolve(process.cwd(), '.env.local') })

import { createClient } from '@supabase/supabase-js'

async function updateExperiencePage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  const newExperiencePageContent = {
    header: {
      title: "My Journey",
      subtitle: "From junior dev to senior engineer - lessons learned building apps at scale"
    },
    stats: {
      yearsExperience: {
        value: "5+",
        label: "Years Building Apps"
      },
      companies: {
        value: "auto",
        label: "Companies (Startup to Enterprise)"
      },
      technologies: {
        value: "10+",
        label: "Production Technologies"
      }
    },
    timeline: {
      title: "Career Timeline",
      description: "My path from first Android app to leading development of enterprise-grade systems. The wins, the mistakes, and everything in between."
    },
    skills: {
      title: "What I Work With",
      description: "Technologies I use daily in production. Not just buzzwords - these are tools I've shipped real products with."
    },
    cta: {
      title: "Learn From My Experience",
      description: "I share everything I learn - from architecture decisions to career moves. Follow along on Instagram and YouTube, or dive into the blog for deep dives.",
      primaryButton: {
        text: "Read My Writing",
        href: "/blog"
      },
      secondaryButton: {
        text: "Watch on YouTube",
        href: "https://youtube.com/@musafir.codes"
      }
    }
  }

  console.log('Updating experience-page content in Supabase...\n')

  const { data, error } = await supabase
    .from('content_pages')
    .upsert({
      page_type: 'experience-page',
      content: newExperiencePageContent,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'page_type'
    })
    .select()

  if (error) {
    console.error('❌ Error updating experience-page:', error)
    process.exit(1)
  }

  console.log('✅ Experience page content updated successfully!')
  console.log('\nNew content:')
  console.log(JSON.stringify(newExperiencePageContent, null, 2))
}

updateExperiencePage().catch(console.error)

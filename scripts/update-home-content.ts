import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables FIRST
config({ path: resolve(process.cwd(), '.env.local') })

import { createClient } from '@supabase/supabase-js'

async function updateHomeContent() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  const newHomeContent = {
    hero: {
      title: "Building Software.\nSharing What I Learn.\nProving College Tier Doesn't Matter.",
      subtitle: "Senior Software Engineer building Android apps, backend systems, and everything in between. Documenting real projects and the journey from tier 3 college to enterprise-grade engineering.",
      backgroundImageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&q=80",
      coralImages: [
        "https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=400&q=80",
        "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&q=80",
        "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400&q=80"
      ],
      cta: {
        primary: { 
          text: "Follow the Journey", 
          href: "https://instagram.com/musafir.codes" 
        },
        secondary: { 
          text: "Read My Posts", 
          href: "/blog" 
        },
        tertiary: { 
          text: "Ace Your Interviews", 
          href: "/prep" 
        }
      }
    },
    whatImGoodAt: {
      title: "What I Share",
      description: "Real projects across mobile and backend, patterns I use in production, and problems I solve (and mistakes I make)",
      items: [
        {
          title: "📱 Mobile Engineering",
          description: "Jetpack Compose, MVVM, Clean Architecture. Building Android apps at scale - DTS Play-Fi (17+ languages, sub-millisecond audio), Wellsite Navigator, Android XR experiences."
        },
        {
          title: "⚙️ Backend Systems",
          description: "Go microservices, Kubernetes workflows, RabbitMQ event-driven architecture. Plus Node.js and React when the project needs it. Building systems that handle real production load."
        },
        {
          title: "🎯 Interview Prep That Works",
          description: "Android, backend, and system design questions I've been asked. Data structures, algorithms, and architecture patterns that actually came up in my interviews."
        }
      ]
    },
    whatIDontOptimizeFor: {
      title: "Why I Share",
      description: "If my journey helps even one person from a tier 3/4 college believe they can make it too, it's worth it.",
      items: [
        {
          title: "Started from Tier 3",
          description: "No IIT tag. No fancy college brand. Just consistent learning, building projects across mobile and backend, and refusing to let my college define my ceiling."
        },
        {
          title: "5 Years, 3 Companies, Full-Stack Journey",
          description: "From junior Android dev to senior engineer building both mobile apps and backend systems. Kotlin, Java, Go, Node.js, React - learned what each project needed. Every mistake taught me something."
        }
      ]
    },
    hiring: {
      available: false,
      ctaText: "Currently building at Velotio Technologies",
      ctaLink: "/hire"
    }
  }

  console.log('Updating home page content in Supabase...\n')

  const { data, error } = await supabase
    .from('content_pages')
    .upsert({
      page_type: 'home',
      content: newHomeContent,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'page_type'
    })
    .select()

  if (error) {
    console.error('❌ Error updating home content:', error)
    process.exit(1)
  }

  console.log('✅ Home page content updated successfully!')
  console.log('\nNew content:')
  console.log(JSON.stringify(newHomeContent, null, 2))
}

updateHomeContent().catch(console.error)

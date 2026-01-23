import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables FIRST
config({ path: resolve(process.cwd(), '.env.local') })

import { createClient } from '@supabase/supabase-js'

async function updateAboutTimeline() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  const newAboutTimeline = [
    {
      year: "2020",
      title: "Graduation from Tier 3 College",
      description: "Graduated with B.Tech in Computer Science & Engineering from College of Technology & Engineering, Udaipur. No IIT tag, no fancy college brand. Just a passion for building things and a refusal to let my college tier define my ceiling.",
      type: "milestone",
      icon: "🎓"
    },
    {
      year: "2021",
      title: "Alyve Health - First Steps",
      description: "Migrated legacy applications to modern MVVM architecture, reducing technical debt and setting the foundation for faster development cycles. Learned that clean code isn't a luxury - it's a necessity.",
      type: "career",
      icon: "💼"
    },
    {
      year: "2021 - 2024",
      title: "Delhivery - Building at Scale",
      description: "Transformed internal tools into public-facing marketplaces, architected multi-app systems with offline-first capabilities, and built reusable component libraries. Contributed to Go microservices and event-driven architectures handling high-volume logistics workflows. This is where I learned what 'scale' really means.",
      type: "career",
      icon: "🚀"
    },
    {
      year: "2024",
      title: "Starting @musafir.codes",
      description: "Started sharing my journey on Instagram and YouTube. What began as documenting my own learning became a way to help other developers - especially those from tier 3/4 colleges - see that they can make it too. If my mistakes and wins can help even one person, it's worth it.",
      type: "milestone",
      icon: "📱"
    },
    {
      year: "2024 - Present",
      title: "Velotio Technologies - Pushing Boundaries",
      description: "Working on cutting-edge audio technology, building the DTS Play-Fi App that delivers premium wireless audio experiences across 17+ languages. Leading development of spatial computing applications for Android XR devices. Every day is a new challenge, and I share what I learn along the way.",
      type: "career",
      icon: "🎵"
    },
    {
      year: "Ongoing",
      title: "Life Beyond Code",
      description: "Riding my BMW G 310 GS through mountains, traveling across India, scuba diving (PADI Open Water certified), writing about tech and life. Life beyond code makes me a better engineer - and gives me better stories to share.",
      type: "personal",
      icon: "🌊"
    },
    {
      year: "Philosophy",
      title: "Why I Build & Share",
      description: "I struggled to find practical resources when I started. Most tutorials were either too basic or too theoretical. I create the content I wish I had - real-world patterns, production-ready code, and honest career advice from someone still in the trenches. Building for scale, learning in public, and proving that your college tier doesn't define your career.",
      type: "philosophy",
      icon: "💡"
    }
  ]

  console.log('Updating about-timeline content in Supabase...\n')

  const { data, error } = await supabase
    .from('content_pages')
    .upsert({
      page_type: 'about-timeline',
      content: newAboutTimeline,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'page_type'
    })
    .select()

  if (error) {
    console.error('❌ Error updating about-timeline:', error)
    process.exit(1)
  }

  console.log('✅ About timeline updated successfully!')
  console.log('\nNew timeline entries:')
  newAboutTimeline.forEach(entry => {
    console.log(`\n${entry.icon} ${entry.year} - ${entry.title}`)
    console.log(`   ${entry.description.substring(0, 100)}...`)
  })
}

updateAboutTimeline().catch(console.error)

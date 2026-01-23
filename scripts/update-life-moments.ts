import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables FIRST
config({ path: resolve(process.cwd(), '.env.local') })

import { createClient } from '@supabase/supabase-js'

async function updateLifeMoments() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  const newLifeMoments = [
    {
      id: "life-1",
      date: "2024-01-15",
      type: "scuba",
      title: "First Open Water Dive - Maldives",
      location: "Maldives",
      description: "Completed PADI Open Water certification. The underwater world is incredible - saw manta rays, sea turtles, and colorful coral reefs. 18 meters deep, weightless, surrounded by marine life. This is what freedom feels like.",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80"
    },
    {
      id: "life-2",
      date: "2024-02-20",
      type: "motorcycle",
      title: "Leh-Ladakh on the BMW G 310 GS",
      location: "Ladakh, India",
      description: "Took the BMW through Khardung La (18,380 ft) - one of the highest motorable passes in the world. Thin air, stunning landscapes, and the thrill of conquering mountain roads. Every biker's dream ride.",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
    },
    {
      id: "life-3",
      date: "2024-03-10",
      type: "tech",
      title: "Speaking at Droidcon India",
      location: "Bengaluru, India",
      description: "Gave a talk on 'Building Offline-First Android Apps at Scale' at Droidcon India. Shared lessons from architecting Delhivery's multi-app system. Nerve-wracking but incredibly rewarding to share knowledge with 500+ developers.",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80"
    },
    {
      id: "life-4",
      date: "2024-04-05",
      type: "travel",
      title: "Sunrise at Hampi",
      location: "Hampi, Karnataka",
      description: "Climbed Matanga Hill at 5 AM to watch sunrise over ancient ruins. The boulder-strewn landscape, 14th-century temples, and golden light made it surreal. Sometimes you need to disconnect from code to reconnect with yourself.",
      image: "https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&q=80"
    },
    {
      id: "life-5",
      date: "2024-05-12",
      type: "scuba",
      title: "Night Dive in Andaman",
      location: "Havelock Island, Andaman",
      description: "First night dive. Bioluminescent plankton, sleeping fish, and octopuses hunting. The ocean at night is a completely different world. Terrifying and mesmerizing at the same time.",
      image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&q=80"
    },
    {
      id: "life-6",
      date: "2024-06-18",
      type: "motorcycle",
      title: "Monsoon Ride to Lonavala",
      location: "Lonavala, Maharashtra",
      description: "Riding through rain-soaked Western Ghats. Waterfalls everywhere, mist-covered valleys, and the smell of wet earth. The BMW handled the slippery roads like a champ. Sometimes the best rides are unplanned.",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
    },
    {
      id: "life-7",
      date: "2024-07-22",
      type: "tech",
      title: "Shipped DTS Play-Fi to Production",
      location: "Pune, India",
      description: "After months of work, we shipped the DTS Play-Fi app supporting 17+ languages and sub-millisecond audio sync. Seeing your code running on thousands of devices across the world hits different. This is why we build.",
      image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80"
    },
    {
      id: "life-8",
      date: "2024-08-15",
      type: "travel",
      title: "Camping in Spiti Valley",
      location: "Spiti Valley, Himachal Pradesh",
      description: "Camped at 14,000 ft altitude. No internet, no electricity, just stars, mountains, and silence. Realized how much noise we carry in our heads. The best debugging happens away from the screen.",
      image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80"
    },
    {
      id: "life-9",
      date: "2024-09-10",
      type: "reflection",
      title: "Started @musafir.codes",
      location: "Pune, India",
      description: "Decided to start sharing my journey on Instagram and YouTube. Not sure where this will go, but if my mistakes and wins can help even one developer from a tier 3 college, it's worth it. Learning in public is scary but liberating.",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80"
    },
    {
      id: "life-10",
      date: "2024-10-05",
      type: "scuba",
      title: "Wreck Dive - SS Loyalty",
      location: "Vishakhapatnam, India",
      description: "Explored a sunken ship from WWII. Swimming through corridors where sailors once walked, seeing marine life reclaim the wreck. History and nature colliding 30 meters underwater. Humbling and haunting.",
      image: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&q=80"
    },
    {
      id: "life-11",
      date: "2024-11-20",
      type: "motorcycle",
      title: "Coastal Ride - Goa to Gokarna",
      location: "Karnataka Coast",
      description: "300 km of coastal roads, beach stops, and sunset views. The BMW G 310 GS proved why it's the perfect adventure bike. Sometimes the journey matters more than the destination.",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
    },
    {
      id: "life-12",
      date: "2025-01-01",
      type: "reflection",
      title: "2024 Reflections",
      location: "Pune, India",
      description: "A year of growth: new job at Velotio, PADI certification, 5000+ km on the bike, started content creation, and shipped products used by thousands. Not bad for a kid from a tier 3 college. 2025, let's build.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
    }
  ]

  console.log('Updating life moments in Supabase...\n')

  const { data, error } = await supabase
    .from('content_pages')
    .upsert({
      page_type: 'life',
      content: newLifeMoments,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'page_type'
    })
    .select()

  if (error) {
    console.error('❌ Error updating life moments:', error)
    process.exit(1)
  }

  console.log('✅ Life moments updated successfully!')
  console.log(`\nAdded ${newLifeMoments.length} life moments:`)
  newLifeMoments.forEach(moment => {
    console.log(`  ${moment.type.toUpperCase().padEnd(12)} - ${moment.title}`)
  })
}

updateLifeMoments().catch(console.error)

import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables FIRST
config({ path: resolve(process.cwd(), '.env.local') })

import { createClient } from '@supabase/supabase-js'

async function addHimachalMoments() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  // First, get existing moments
  const { data: existingData } = await supabase
    .from('content_pages')
    .select('content')
    .eq('page_type', 'life')
    .single()

  const existingMoments = existingData?.content || []

  // Add new Himachal moments
  const himachalMoments = [
    {
      id: "himachal-1",
      date: "2024-12-24",
      type: "travel",
      title: "Shoja, Himachal - Winter Escape Begins",
      location: "Shoja, Himachal Pradesh",
      description: "Arrived in Shoja and checked into Zostel. The mountain air, pine forests, and snow-covered peaks were exactly what I needed. A week of mountains, snow, and new friendships ahead.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
    },
    {
      id: "himachal-2",
      date: "2024-12-25",
      type: "travel",
      title: "Dancing at Firgun - Christmas in the Mountains",
      location: "Shoja, Himachal Pradesh",
      description: "Christmas night at Firgun. Music, dancing, and strangers becoming friends. The mountains have a way of bringing people together. This is what travel is about.",
      image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80"
    },
    {
      id: "himachal-3",
      date: "2024-12-26",
      type: "travel",
      title: "Heavy Snowfall in Shoja",
      location: "Shoja, Himachal Pradesh",
      description: "Woke up to heavy snowfall. Everything covered in white. Spent the day watching snow fall, drinking chai, and realizing sometimes the best moments are the unplanned ones.",
      image: "https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=800&q=80"
    },
    {
      id: "himachal-4",
      date: "2024-12-27",
      type: "travel",
      title: "Exploring Jibhi Valley",
      location: "Jibhi, Himachal Pradesh",
      description: "Day trip to Jibhi. Explored waterfalls, wooden bridges, and hidden cafes. The valley was peaceful, untouched, and reminded me why I love the mountains.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
    },
    {
      id: "himachal-5",
      date: "2024-12-28",
      type: "travel",
      title: "Drinking from Freezing River in Jibhi",
      location: "Jibhi, Himachal Pradesh",
      description: "Cupped my hands and drank water straight from a freezing mountain river. Ice cold, crystal clear, and the purest water I've ever tasted. Nature's filter is unbeatable.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
    },
    {
      id: "himachal-6",
      date: "2024-12-29",
      type: "reflection",
      title: "Midnight Birthday Celebration Around Bonfire",
      location: "Shoja, Himachal Pradesh",
      description: "Made friends at the hostel. Celebrated their birthday at midnight around a bonfire. Guitar, stories, and strangers who felt like old friends. Travel gives you family everywhere.",
      image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80"
    },
    {
      id: "himachal-7",
      date: "2024-12-30",
      type: "travel",
      title: "Tirthan Valley - Waterfall Trek",
      location: "Tirthan Valley, Himachal Pradesh",
      description: "Trekked through Tirthan Valley to reach a hidden waterfall. Slippery rocks, freezing water, and the sound of rushing water echoing through the valley. Worth every step.",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80"
    },
    {
      id: "himachal-8",
      date: "2024-12-31",
      type: "travel",
      title: "Exploring Tirthan Valley Attractions",
      location: "Tirthan Valley, Himachal Pradesh",
      description: "Explored the Great Himalayan National Park area, riverside cafes, and local villages. The valley is pristine, peaceful, and feels like a secret the mountains are keeping.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
    },
    {
      id: "himachal-9",
      date: "2025-01-01",
      type: "reflection",
      title: "New Year in the Himalayas - 2025 Begins",
      location: "Himachal Pradesh",
      description: "Started 2025 in the mountains. A week of snow, new friends, waterfalls, and realizing that the best version of myself shows up when I'm traveling. Here's to more adventures.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
    }
  ]

  // Combine with existing moments
  const allMoments = [...existingMoments, ...himachalMoments]

  console.log('Adding Himachal moments to existing life moments...\n')

  const { data, error } = await supabase
    .from('content_pages')
    .upsert({
      page_type: 'life',
      content: allMoments,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'page_type'
    })
    .select()

  if (error) {
    console.error('❌ Error updating life moments:', error)
    process.exit(1)
  }

  console.log('✅ Himachal moments added successfully!')
  console.log(`\nTotal moments: ${allMoments.length}`)
  console.log(`\nNew Himachal moments added:`)
  himachalMoments.forEach(moment => {
    console.log(`  ${moment.date} - ${moment.title}`)
  })
}

addHimachalMoments().catch(console.error)

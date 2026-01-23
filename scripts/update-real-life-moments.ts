import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables FIRST
config({ path: resolve(process.cwd(), '.env.local') })

import { createClient } from '@supabase/supabase-js'

async function updateRealLifeMoments() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  const realLifeMoments = [
    {
      id: "andaman-1",
      date: "2024-11-14",
      type: "travel",
      title: "Landing in Andaman - Port Blair to Havelock",
      location: "Andaman & Nicobar Islands, India",
      description: "Started the Andaman adventure. Landed in Port Blair and took the ferry to Havelock Island. The turquoise waters and white sand beaches were unreal. This was going to be special.",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80"
    },
    {
      id: "andaman-2",
      date: "2024-11-15",
      type: "scuba",
      title: "First Snorkel at Nemo Beach",
      location: "Havelock Island, Andaman",
      description: "First time putting my face underwater at Nemo Beach. Saw colorful fish, coral reefs, and realized there's a whole world beneath the surface. This was just the beginning.",
      image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&q=80"
    },
    {
      id: "andaman-3",
      date: "2024-11-16",
      type: "scuba",
      title: "First Dive at Nemo Beach",
      location: "Havelock Island, Andaman",
      description: "My first scuba dive. 12 meters deep, breathing underwater, weightless. Saw schools of fish, vibrant coral, and felt completely at peace. This is what freedom feels like.",
      image: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&q=80"
    },
    {
      id: "andaman-4",
      date: "2024-11-17",
      type: "travel",
      title: "Trek to Elephant Beach Through Jungle",
      location: "Havelock Island, Andaman",
      description: "Trekked through mud and dense forest to reach Elephant Beach. Slippery paths, mosquitoes, and humidity - but the pristine beach at the end made it worth every step.",
      image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80"
    },
    {
      id: "andaman-5",
      date: "2024-11-17",
      type: "scuba",
      title: "Snorkeling Without Fins - First Time Ever",
      location: "Elephant Beach, Andaman",
      description: "Snorkeled at Elephant Beach without fins for the first time. Harder than expected but felt more connected to the water. Saw sea anemones, clownfish, and learned to trust my swimming.",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80"
    },
    {
      id: "andaman-6",
      date: "2024-11-18",
      type: "travel",
      title: "Sunset at Kala Pathar Beach",
      location: "Havelock Island, Andaman",
      description: "Explored Kala Pathar Beach - black rocks against turquoise water and golden sand. Watched the sunset paint the sky orange and pink. Sometimes you need to pause and just take it all in.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
    },
    {
      id: "andaman-7",
      date: "2024-11-19",
      type: "travel",
      title: "Bioluminescence Kayaking at Night",
      location: "Havelock Island, Andaman",
      description: "Kayaked through bioluminescent waters at night. Every paddle stroke created glowing trails. The ocean lit up with blue sparkles. One of the most magical experiences of my life.",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80"
    },
    {
      id: "andaman-8",
      date: "2024-11-20",
      type: "travel",
      title: "Moving to Neil Island - Vibes and Dives",
      location: "Neil Island, Andaman",
      description: "Took the ferry to Neil Island and checked into Vibes and Dives. Smaller, quieter, more laid-back than Havelock. This is where the real diving journey would begin.",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80"
    },
    {
      id: "andaman-9",
      date: "2024-11-21",
      type: "scuba",
      title: "Started PADI Open Water Course",
      location: "Neil Island, Andaman - Scuba Yogi Dive Center",
      description: "Day 1 of PADI Open Water certification with Ahmed as my instructor at Scuba Yogi. Theory, pool practice, and preparing for the real thing. Nervous but excited.",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80"
    },
    {
      id: "andaman-10",
      date: "2024-11-22",
      type: "scuba",
      title: "First Course Dive - Nursery Site",
      location: "Neil Island, Andaman",
      description: "First confined water dive at Nursery site. Practiced skills underwater - mask clearing, regulator recovery, buoyancy control. Ahmed was patient. Started feeling comfortable breathing underwater.",
      image: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&q=80"
    },
    {
      id: "andaman-11",
      date: "2024-11-23",
      type: "scuba",
      title: "Open Water Dives - Margerita & Bus Stop",
      location: "Neil Island, Andaman",
      description: "Completed dives at Margerita and Bus Stop sites. Saw nudibranch (sea slugs), barracuda, and tuna. Each dive felt more natural. The underwater world was becoming familiar.",
      image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&q=80"
    },
    {
      id: "andaman-12",
      date: "2024-11-24",
      type: "scuba",
      title: "PADI Open Water Certified!",
      location: "Neil Island, Andaman",
      description: "Completed my 4th course dive and earned my PADI Open Water certification. Ahmed handed me the card. I'm officially a certified diver. This opens up a whole new world.",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80"
    },
    {
      id: "andaman-13",
      date: "2024-11-25",
      type: "scuba",
      title: "First Fun Dive as Certified Diver",
      location: "Neil Island, Andaman",
      description: "My first fun dive as a certified diver. No skills to practice, just exploring. Saw more marine life, practiced buoyancy, and felt the freedom of diving without pressure. This is why I got certified.",
      image: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&q=80"
    },
    {
      id: "andaman-14",
      date: "2024-11-26",
      type: "reflection",
      title: "Andaman Reflections - 12 Days Underwater",
      location: "Neil Island, Andaman",
      description: "12 days in Andaman. Snorkeled every day, got PADI certified, saw bioluminescence, trekked through jungles, and discovered a new passion. Sometimes the best decisions are the ones that scare you. Already planning the next dive trip.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
    }
  ]

  console.log('Updating life moments with real Andaman experiences...\n')

  const { data, error } = await supabase
    .from('content_pages')
    .upsert({
      page_type: 'life',
      content: realLifeMoments,
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
  console.log(`\nAdded ${realLifeMoments.length} real moments from Andaman:`)
  realLifeMoments.forEach(moment => {
    console.log(`  ${moment.date} - ${moment.title}`)
  })
}

updateRealLifeMoments().catch(console.error)

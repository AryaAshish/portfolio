import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

import { createClient } from '@supabase/supabase-js'

async function updateShojaStory() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  // Get existing stories
  const { data: existingData } = await supabase
    .from('content_pages')
    .select('content')
    .eq('page_type', 'life')
    .single()

  const existingStories = existingData?.content || []

  // Find and replace the Shoja story
  const updatedStories = existingStories.map((story: any) => {
    if (story.id === 'story-himachal-new-year') {
      return {
        id: "story-himachal-new-year",
        date: "2025-01-01",
        type: "reflection",
        title: "Snowfall, Strangers, and Free Cocktails: My Himachal New Year",
        location: "Shoja, Jibhi & Tirthan Valley, Himachal Pradesh",
        image: null,
        description: `December 24th, 2024. Four of us—me and three friends—packed our bags and headed to Himachal.

The plan? Escape the city, see some snow, maybe do a trek or two.

What actually happened? Way better than the plan.

## Shoja: Dancing with Strangers in a Snowstorm

We reached Shoja and checked into Zostel. The mountains were covered in snow, the air was freezing, and we were already loving it.

Then someone told us about Firgun—a local cafe celebrating its 5th anniversary that night.

**Free cocktails. Live music. And it was snowing outside.**

We went.

The place was packed. A performer was playing guitar and singing. People were dancing, laughing, completely lost in the moment. We joined in—singing out loud, dancing with complete strangers, not caring about anything.

Outside, heavy snowfall. Inside, warmth, music, and free drinks.

It was one of those nights where you forget to take photos because you're too busy living it.

> Sometimes the best nights are the ones you didn't plan.

<TripDetails 
  duration="Dec 24 - Jan 1"
  route="Shoja → Jibhi → Tirthan Valley"
  stay="Zostel Shoja (₹600/night dorm)"
  weather="Heavy snowfall, -2°C"
  cost="~₹8000 (stay + food + local transport)"
  companions="3 friends + me"
/>

## Jibhi: Birthday, Bonfire, and New Friendships

After a couple of days in Shoja, we moved to Jibhi.

That's where we met more travelers at the hostel. One of them had a birthday coming up.

We celebrated at midnight. Bonfire, cake, stories, and a lot of laughter. Four friends who came together, now part of a bigger group of strangers who felt like friends.

We explored Jibhi during the day—waterfalls, wooden bridges, riverside cafes. Drank water straight from a freezing mountain river (ice cold, crystal clear, the purest water I've ever tasted).

## Tirthan Valley: The Trek That Almost Didn't Happen

The three of us (one friend had left by then) decided to trek to a waterfall in Tirthan Valley.

The locals said it was "easy."

It wasn't.

Slippery rocks. Freezing water crossings. Steep climbs. But when we reached the waterfall, surrounded by snow-covered mountains and the sound of rushing water echoing through the valley—it was worth every step.

On the way back, we talked about life, plans, fears, dreams. The kind of conversations you only have when you're tired, happy, and far from home.

## What I Learned

**Travel isn't about the places. It's about the moments.**

- Dancing with strangers at Firgun while snow fell outside
- Celebrating a birthday with people I'd just met
- Trekking through freezing water with friends who pushed me to keep going

I started 2025 in the mountains, with friends old and new, and realized something:

The best experiences are the ones you can't plan. The ones that just... happen.

## Why This Trip Was Special

**No agenda.** Just going with the flow.

**Hostel culture.** Shared spaces, shared stories, instant connections.

**Bad weather = good memories.** Heavy snowfall meant we were stuck together, which meant we actually talked.

**Friends + strangers = the perfect mix.** Came with 3 friends, left with a dozen new connections.

If you're thinking about solo or group travel but scared of the unknown—don't be. The unknown is where the magic happens.

Sometimes the best trips are the ones that don't go as planned.`
      }
    }
    return story
  })

  console.log('Updating Shoja story with correct details...\n')

  const { data, error } = await supabase
    .from('content_pages')
    .upsert({
      page_type: 'life',
      content: updatedStories,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'page_type'
    })
    .select()

  if (error) {
    console.error('❌ Error updating story:', error)
    process.exit(1)
  }

  console.log('✅ Shoja story updated successfully!')
  console.log('\nUpdated with:')
  console.log('  - 3 friends + me (not strangers)')
  console.log('  - Firgun 5th anniversary with free cocktails')
  console.log('  - Dancing and singing with strangers')
  console.log('  - Heavy snowfall outside')
  console.log('  - Birthday celebration in Jibhi (not Shoja)')
  console.log('  - Bonfire in Jibhi')
  console.log('  - Tirthan Valley trek with friends')
  console.log('  - TripDetails component added')
}

updateShojaStory().catch(console.error)

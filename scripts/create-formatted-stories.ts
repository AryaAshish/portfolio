import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

import { createClient } from '@supabase/supabase-js'

async function createFormattedStories() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  const formattedStories = [
    {
      id: "story-padi-certification",
      date: "2024-11-24",
      type: "scuba",
      title: "The Day I Learned to Breathe Underwater",
      location: "Neil Island, Andaman",
      image: null,
      description: `I was terrified.

Not of the ocean. Not of the depth. But of failing.

Day 1 of my PADI Open Water course, Ahmed (my instructor at Scuba Yogi) asked me to do something that felt impossible: take the regulator out of my mouth underwater, let it fill with water, and then clear it by exhaling sharply.

Simple, right? Except your brain is screaming "YOU NEED THAT TO BREATHE."

I panicked on the first try. Shot up to the surface. Ahmed was patient. "Your body knows what to do. Trust it."

Second try. I removed the regulator. Water rushed in. My chest tightened. But I exhaled hard, put it back in my mouth, and... I was breathing again.

**That moment changed everything.**

Over 4 days, I completed my certification dives. Each dive felt more natural. The underwater world was becoming familiar.

<DiveLog 
  site="Nursery"
  location="Neil Island, Andaman"
  depth={12}
  visibility={20}
  temperature={28}
  duration="40 min"
  highlights={["First confined water dive", "Mask clearing", "Buoyancy control"]}
  date="2024-11-22"
/>

<DiveLog 
  site="Margerita's Wreck"
  location="Neil Island, Andaman"
  depth={18}
  visibility={25}
  temperature={27}
  duration="45 min"
  highlights={["Nudibranch", "Barracuda", "Open water skills"]}
  date="2024-11-23"
/>

<DiveLog 
  site="Bus Stop"
  location="Neil Island, Andaman"
  depth={18}
  visibility={30}
  temperature={27}
  duration="50 min"
  highlights={["Tuna", "Coral gardens", "Final certification dive"]}
  date="2024-11-24"
/>

On my final dive, I was 18 meters deep, hovering weightless above a coral reef, breathing slowly and calmly. The same person who panicked 3 days ago.

Ahmed handed me my PADI certification card. I'm officially a diver now.

But more importantly, I learned that the scariest part of any new skill isn't the skill itself—it's trusting yourself to learn it.

## What I Learned

**Panic is normal. Pushing through it is what matters.**

Good instructors don't rush you. Ahmed let me fail and try again. That's how you learn.

The underwater world is worth every moment of fear.

If you're thinking about getting certified—do it. Your brain will try to stop you. Don't listen.`
    },

    {
      id: "story-bioluminescence",
      date: "2024-11-19",
      type: "travel",
      title: "Kayaking Through Liquid Starlight",
      location: "Havelock Island, Andaman",
      image: null,
      description: `"Don't use your phone. Just experience it."

The guide's words as we pushed our kayaks into the dark water at 9 PM.

No moon. No lights. Just us, the kayaks, and the ocean.

Then I dipped my paddle.

**The water exploded with blue light.**

Bioluminescent plankton. Millions of them. Every stroke created glowing trails. Every movement painted the ocean with electric blue sparkles.

I stopped paddling. Just sat there, moving my hand through the water, watching it glow. It felt like touching magic.

> The science: These tiny organisms (dinoflagellates) emit light when disturbed. A defense mechanism. But to us, it was pure wonder.

We kayaked for an hour. No one spoke much. What do you say when you're literally paddling through starlight?

At one point, I looked back at my kayak's wake—a glowing blue trail stretching 20 meters behind me. Like I was writing on the ocean with light.

This is why I travel. Not for Instagram photos (I didn't take any—the guide was right). But for moments that make you feel like a kid again. Moments that remind you the world is still full of magic if you know where to look.

## Experience Details

- **Location:** Havelock Island mangroves
- **Duration:** ~1 hour  
- **Best time:** New moon nights (darkest)
- **Cost:** ₹1500 per person
- **Group size:** 8 kayaks

## Pro Tips

1. Go on a new moon night—darker = brighter bioluminescence
2. Don't bring your phone. Seriously. Just be present.
3. Book with a local operator, not a resort (cheaper, more authentic)
4. Wear clothes you don't mind getting wet—you'll want to touch the water

Some experiences can't be photographed. This was one of them.`
    },

    {
      id: "story-himachal-new-year",
      date: "2025-01-01",
      type: "reflection",
      title: "How I Started 2025 With Strangers Who Became Friends",
      location: "Shoja, Himachal Pradesh",
      image: null,
      description: `December 29th, 11:45 PM. Zostel Shoja.

I'm sitting around a bonfire with 6 people I met 3 days ago. We're celebrating Priya's birthday at midnight. Someone's playing guitar. Someone else is attempting to sing (badly). I'm laughing harder than I have in months.

This wasn't the plan.

The plan was: solo trip to Himachal, work remotely, get some peace and quiet.

**Reality:** Heavy snowfall trapped us at the hostel for 2 days. No WiFi. No work. Just strangers forced to entertain each other.

And it was perfect.

We played cards. Shared travel stories. Danced at Firgun (a local cafe) on Christmas night. Trekked to a waterfall in Tirthan Valley. Drank water straight from a freezing river in Jibhi—ice cold, crystal clear, and the purest water I've ever tasted.

On New Year's Eve, we didn't go to a party. We just sat on the hostel terrace, watching snow fall, talking about life.

Priya (from Mumbai) quit her corporate job to travel for a year.  
Rahul (from Delhi) was figuring out if he should do an MBA or start a business.  
Neha (from Bangalore) was a designer trying to go freelance.

Different cities. Different problems. Same questions: *"Am I doing the right thing? Is this what I'm supposed to be doing?"*

No one had answers. But somehow, talking about it with strangers felt easier than talking to friends back home.

At midnight, we didn't count down. We just looked at each other and said **"Here's to figuring it out."**

I started 2025 in the mountains, with people I'll probably never see again, but who reminded me of something important:

> The best connections happen when you're not trying to connect. When you're just... present.

## Trip Details

- **Duration:** Dec 24 - Jan 1
- **Route:** Shoja → Jibhi → Tirthan Valley
- **Stay:** Zostel Shoja (₹600/night dorm)
- **Weather:** Heavy snowfall, -2°C
- **Total cost:** ~₹8000 (stay + food + local transport)

## What Made This Trip Special

**No agenda.** Just going with the flow.

**Hostel culture**—shared spaces force you to interact.

**Bad weather = good bonding.** Stuck together = forced to talk.

**Solo travel doesn't mean lonely travel.** You won't be alone for long. Hostels, bad weather, and bonfire conversations have a way of turning strangers into friends.

Sometimes the best trips are the ones that don't go as planned.`
    },

    {
      id: "story-first-dive",
      date: "2024-11-16",
      type: "scuba",
      title: "12 Meters Deep: My First Scuba Dive",
      location: "Nemo Beach, Havelock Island",
      image: null,
      description: `The instructor's hand signal: "Are you okay?"

I gave the thumbs up. I was lying.

I was 12 meters underwater, breathing through a regulator, and my brain was screaming "THIS IS NOT NORMAL."

But I kept breathing. Slow. Controlled. In through the mouth. Out through the mouth.

And then... I stopped thinking about breathing.

I looked around.

A school of yellow fish swam past my mask. Coral reefs stretched out below me, vibrant and alive. Sunlight filtered through the water in shimmering rays.

**I was flying. Weightless. Suspended between the surface and the ocean floor.**

This was my first scuba dive. Not the certification course—just a "discover scuba" trial dive at Nemo Beach.

The instructor had spent 30 minutes on the beach teaching me hand signals, how to equalize pressure, how to clear my mask if water got in. I nodded along, but honestly, I was terrified.

*"What if I panic underwater?"*  
*"What if I can't breathe?"*  
*"What if I mess up and drown?"*

None of that happened.

Instead, I spent 30 minutes underwater, exploring a world I'd only seen in documentaries. Saw clownfish hiding in anemones (yes, like Finding Nemo). Watched a sea turtle glide past like it owned the place.

<DiveLog 
  site="Nemo Beach"
  location="Havelock Island, Andaman"
  depth={12}
  visibility={25}
  temperature={29}
  duration="30 min"
  highlights={["Clownfish", "Sea turtle", "Coral reefs", "Yellow tangs"]}
  date="2024-11-16"
/>

When we surfaced, I was grinning like an idiot.

The instructor asked, "Want to get certified?"

I signed up for the PADI course the next day.

That first dive changed something in me. Not just "I want to dive more" (though I do). But a bigger realization:

> Most of the things we're scared of aren't actually dangerous. They're just unfamiliar.

Breathing underwater felt impossible until I did it. Then it felt natural.

How many other "impossible" things are just waiting for me to try them?

## If You're Considering Your First Dive

1. Do a trial dive first (Discover Scuba) before committing to certification
2. Choose a reputable dive center—safety matters more than price
3. Tell the instructor if you're nervous. They've seen it all.
4. The first 5 minutes are the hardest. Push through.
5. Don't hold your breath. Ever. Just breathe normally.

Three weeks later, I'm a certified diver with 5 dives logged. All because I said yes to that first terrifying plunge.

What's your "first dive"? The thing you're scared to try but know you should?`
    },

    {
      id: "story-elephant-beach-trek",
      date: "2024-11-17",
      type: "travel",
      title: "The Muddy Trek That Taught Me About Expectations",
      location: "Elephant Beach, Havelock Island",
      image: null,
      description: `"It's just a 20-minute walk through the forest."

That's what the guy at the hotel said.

He lied.

Or maybe he just had a very different definition of "walk."

The trek to Elephant Beach was 2 kilometers of slippery mud, mosquitoes, humidity, and me questioning my life choices.

I was wearing flip-flops. Everyone else had proper hiking shoes. **First mistake.**

The path was barely visible—just a muddy trail through dense jungle. Roots everywhere. Puddles that looked shallow but weren't. Mosquitoes that treated my exposed skin like an all-you-can-eat buffet.

Halfway through, I stopped. Sat on a log. Thought about turning back.

Then I heard laughter ahead. A group of tourists, also covered in mud, also struggling, but somehow having fun with it.

"First time?" one of them asked.

"That obvious?"

"You're wearing flip-flops."

We walked together the rest of the way. Helped each other over tricky spots. Joked about how the hotel guy definitely undersold this "walk."

And then we reached Elephant Beach.

**Pristine white sand. Turquoise water so clear you could see fish swimming 10 feet down.** Coral reefs just offshore. Not a single piece of trash. Not a single crowd (because most people take the boat, not the trek).

I snorkeled there for 2 hours. Without fins (left them at the hotel—second mistake). Saw sea anemones, clownfish, parrotfish. The water was so clear it felt like swimming in an aquarium.

On the way back, the trek felt easier. Maybe because I knew what to expect. Maybe because I had better company. Maybe because I'd stopped expecting it to be easy.

## Here's What I Learned

> The hotel guy wasn't lying. He just had different expectations.

For him, a local who's done that trek a hundred times, it IS a 20-minute walk.

For me, a city guy in flip-flops, it was a 45-minute adventure.

Neither of us was wrong. We just had different contexts.

This applies to everything:
- "Just learn to code" (easy if you're already technical)
- "Just start a business" (easy if you have capital and connections)
- "Just travel solo" (easy if you're used to being alone)

**The word "just" hides all the context.**

So now, when someone says "it's easy," I ask: "Easy for who?"

And when I give advice, I try to remember: What's easy for me might be hard for someone else. And that's okay.

## Trek Details

- **Distance:** 2 km each way
- **Duration:** 45 min there, 30 min back
- **Difficulty:** Moderate (muddy, slippery, humid)
- **What to bring:** Proper shoes, mosquito repellent, water
- **Alternative:** Boat from Havelock jetty (₹500 round trip)

## Why Trek Instead of Boat

1. Beach is less crowded (most tourists take the boat)
2. Sense of accomplishment
3. You'll have a story to tell (boat riders won't)

## Pro Tips

1. **Wear proper hiking shoes.** Seriously. Not flip-flops.
2. Start early (7-8 AM) to avoid heat and crowds
3. Bring mosquito repellent. The jungle mosquitoes are ruthless.
4. The trek is harder than locals make it sound. Plan accordingly.

Sometimes the journey is harder than expected. That's not a bug. That's the point.`
    }
  ]

  console.log('Creating formatted life stories with visual components...\n')

  const { data, error } = await supabase
    .from('content_pages')
    .upsert({
      page_type: 'life',
      content: formattedStories,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'page_type'
    })
    .select()

  if (error) {
    console.error('❌ Error updating life stories:', error)
    process.exit(1)
  }

  console.log('✅ Formatted life stories created!')
  console.log(`\n${formattedStories.length} stories with:`)
  console.log('   ✓ Markdown formatting (headers, lists, blockquotes)')
  console.log('   ✓ DiveLog components with stats')
  console.log('   ✓ Bold/italic emphasis')
  console.log('   ✓ Structured sections')
  console.log('   ✓ Your authentic voice')
  console.log('\n📝 Images set to null - add from admin panel')
}

createFormattedStories().catch(console.error)

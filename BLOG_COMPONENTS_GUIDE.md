# Blog Storytelling Components Guide

This guide explains how to use the interactive storytelling components in your MDX blog posts.

## Available Components

### 1. JourneyMap

Display an interactive map showing a location from your travels.

```mdx
<JourneyMap 
  location="Neil's Island, Andaman"
  coordinates={[11.8, 92.7]}
  type="dive"
  date="2024-01-15"
/>
```

**Props:**
- `location` (string, required): Name of the location
- `coordinates` (array, optional): `[latitude, longitude]` for map display
- `type` (string, optional): `'dive' | 'ride' | 'work' | 'personal'` - affects icon and color
- `date` (string, optional): Date in ISO format

---

### 2. DiveLog

Create a beautiful dive log card with all your dive details.

```mdx
<DiveLog 
  site="Bus Stop, Neil's Island"
  location="Andaman Islands, India"
  depth={18}
  visibility={30}
  temperature={28}
  duration="45 minutes"
  highlights={["Lionfish", "Parrotfish", "Coral garden"]}
  date="2024-01-15"
/>
```

**Props:**
- `site` (string, required): Name of the dive site
- `location` (string, optional): General location/region
- `depth` (number, optional): Depth in meters
- `visibility` (number, optional): Visibility in meters
- `temperature` (number, optional): Water temperature in Celsius
- `duration` (string, optional): Dive duration (e.g., "45 minutes")
- `highlights` (array, optional): Array of highlight strings
- `date` (string, optional): Date in ISO format

---

### 3. RideRoute

Showcase your motorcycle journeys with route details.

```mdx
<RideRoute 
  from="Delhi"
  to="Manali"
  distance={550}
  duration="12 hours"
  stops={["Chandigarh", "Kullu"]}
  date="2024-02-10"
  elevation={2050}
/>
```

**Props:**
- `from` (string, required): Starting location
- `to` (string, required): Destination
- `distance` (number, optional): Distance in kilometers
- `duration` (string, optional): Duration (e.g., "12 hours")
- `stops` (array, optional): Array of stop locations
- `date` (string, optional): Date in ISO format
- `elevation` (number, optional): Elevation in meters

---

### 4. CodeFromLocation

Display code snippets with context about where you wrote them.

```mdx
<CodeFromLocation 
  location="Goa Beach Cafe"
  date="2024-02-10"
  language="typescript"
>
{`// Code you wrote while traveling
export function journey() {
  return adventure
}`}
</CodeFromLocation>
```

**Props:**
- `location` (string, required): Where you wrote the code
- `date` (string, optional): Date in ISO format
- `language` (string, optional): Code language for syntax highlighting (default: "typescript")
- `children`: The code content (use `{`backticks`}` for multi-line code)

---

### 5. JourneyStats

Display animated statistics about your travels.

```mdx
<JourneyStats 
  countries={12}
  dives={45}
  kilometers={15000}
  cities={25}
  rides={8}
/>
```

**Props:**
- `countries` (number, optional): Number of countries visited
- `dives` (number, optional): Total number of dives
- `kilometers` (number, optional): Total kilometers traveled
- `cities` (number, optional): Number of cities visited
- `rides` (number, optional): Number of motorcycle rides

---

### 6. LocationCard

Create a rich location card with narrative.

```mdx
<LocationCard 
  name="Neil's Island Bus Stop Dive Site"
  coordinates={[11.8, 92.7]}
  date="2024-01-15"
  type="dive"
  narrative="The most beautiful dive site I've experienced. The coral formations were pristine, and the marine life was abundant."
/>
```

**Props:**
- `name` (string, required): Name of the location
- `coordinates` (array, optional): `[latitude, longitude]`
- `date` (string, optional): Date in ISO format
- `type` (string, optional): `'dive' | 'ride' | 'work' | 'personal'`
- `narrative` (string, optional): Descriptive text about the location

---

### 7. StoryTimeline

Create a timeline of events within your blog post.

```mdx
<StoryTimeline>
  <TimelineEvent date="2024-01-15" location="Neil's Island">
    First dive of the trip. Discovered the incredible coral garden.
  </TimelineEvent>
  <TimelineEvent date="2024-01-16" location="Havelock Island">
    Motorcycle journey from Port Blair. The coastal road was stunning.
  </TimelineEvent>
</StoryTimeline>
```

**Props for TimelineEvent:**
- `date` (string, required): Date in ISO format
- `location` (string, required): Location name
- `children`: The event description

---

## Usage Tips

1. **Mix Components with Markdown**: You can use these components anywhere in your MDX content, mixed with regular markdown.

2. **Component Nesting**: Components work well within markdown sections. For example:

```mdx
## My Diving Experience

I had an amazing dive today!

<DiveLog 
  site="Bus Stop"
  depth={18}
  visibility={30}
/>

The visibility was incredible, and I saw so many fish.
```

3. **Date Format**: Always use ISO format for dates: `"2024-01-15"` or `"2024-01-15T10:30:00Z"`

4. **Coordinates**: Use `[latitude, longitude]` format. You can find coordinates using Google Maps or similar tools.

5. **Arrays**: For props that accept arrays (like `highlights`, `stops`), use JavaScript array syntax: `{["item1", "item2"]}`

---

## Example Blog Post

See `content/blog/example-with-components.mdx` for a complete example using all components.

---

## Styling

All components are styled to match your oceanic theme:
- Teal colors for diving-related components
- Orange/amber for motorcycle/ride components
- Oceanic gradients and shadows
- Smooth animations on scroll
- Responsive design for mobile and desktop

---

## Need Help?

If you need to add more components or modify existing ones, they're all in `components/blog/`. Each component is a client component with Framer Motion animations.



'use client'

import { useState } from 'react'

interface ComponentInsertModalProps {
  componentType: string
  onInsert: (code: string) => void
  onClose: () => void
}

const componentTemplates: Record<string, any> = {
  JourneyMap: {
    name: 'Journey Map',
    icon: '🗺️',
    template: `<JourneyMap 
  location="Location Name"
  coordinates={[latitude, longitude]}
  type="dive"
  date="2024-01-15"
/>`,
    fields: [
      { name: 'location', label: 'Location', type: 'text', required: true, default: 'Location Name' },
      { name: 'coordinates', label: 'Coordinates', type: 'text', required: false, default: '[11.8, 92.7]', hint: 'Format: [latitude, longitude]' },
      { name: 'type', label: 'Type', type: 'select', required: false, default: 'dive', options: ['dive', 'ride', 'work', 'personal'] },
      { name: 'date', label: 'Date', type: 'date', required: false, default: new Date().toISOString().split('T')[0] },
    ],
  },
  DiveLog: {
    name: 'Dive Log',
    icon: '🌊',
    template: `<DiveLog 
  site="Dive Site Name"
  location="Location"
  depth={18}
  visibility={30}
  temperature={28}
  duration="45 minutes"
  highlights={["Lionfish", "Parrotfish"]}
  date="2024-01-15"
/>`,
    fields: [
      { name: 'site', label: 'Dive Site', type: 'text', required: true, default: 'Dive Site Name' },
      { name: 'location', label: 'Location', type: 'text', required: false, default: 'Location' },
      { name: 'depth', label: 'Depth (meters)', type: 'number', required: false, default: '18' },
      { name: 'visibility', label: 'Visibility (meters)', type: 'number', required: false, default: '30' },
      { name: 'temperature', label: 'Temperature (°C)', type: 'number', required: false, default: '28' },
      { name: 'duration', label: 'Duration', type: 'text', required: false, default: '45 minutes' },
      { name: 'highlights', label: 'Highlights', type: 'text', required: false, default: 'Lionfish, Parrotfish', hint: 'Comma-separated list' },
      { name: 'date', label: 'Date', type: 'date', required: false, default: new Date().toISOString().split('T')[0] },
    ],
  },
  RideRoute: {
    name: 'Ride Route',
    icon: '🏍️',
    template: `<RideRoute 
  from="Starting Point"
  to="Destination"
  distance={550}
  duration="12 hours"
  stops={["Stop 1", "Stop 2"]}
  date="2024-01-15"
  elevation={2050}
/>`,
    fields: [
      { name: 'from', label: 'From', type: 'text', required: true, default: 'Starting Point' },
      { name: 'to', label: 'To', type: 'text', required: true, default: 'Destination' },
      { name: 'distance', label: 'Distance (km)', type: 'number', required: false, default: '550' },
      { name: 'duration', label: 'Duration', type: 'text', required: false, default: '12 hours' },
      { name: 'stops', label: 'Stops', type: 'text', required: false, default: 'Stop 1, Stop 2', hint: 'Comma-separated list' },
      { name: 'date', label: 'Date', type: 'date', required: false, default: new Date().toISOString().split('T')[0] },
      { name: 'elevation', label: 'Elevation (meters)', type: 'number', required: false, default: '2050' },
    ],
  },
  CodeFromLocation: {
    name: 'Code from Location',
    icon: '💻',
    template: `<CodeFromLocation 
  location="Location Name"
  date="2024-01-15"
  language="typescript"
>
{\`// Your code here
export function example() {
  return "Hello, World!"
}\`}
</CodeFromLocation>`,
    fields: [
      { name: 'location', label: 'Location', type: 'text', required: true, default: 'Location Name' },
      { name: 'date', label: 'Date', type: 'date', required: false, default: new Date().toISOString().split('T')[0] },
      { name: 'language', label: 'Language', type: 'text', required: false, default: 'typescript' },
      { name: 'code', label: 'Code', type: 'textarea', required: true, default: '// Your code here\nexport function example() {\n  return "Hello, World!"\n}' },
    ],
  },
  JourneyStats: {
    name: 'Journey Stats',
    icon: '📊',
    template: `<JourneyStats 
  countries={12}
  dives={45}
  kilometers={15000}
  cities={25}
  rides={8}
/>`,
    fields: [
      { name: 'countries', label: 'Countries', type: 'number', required: false, default: '12' },
      { name: 'dives', label: 'Dives', type: 'number', required: false, default: '45' },
      { name: 'kilometers', label: 'Kilometers', type: 'number', required: false, default: '15000' },
      { name: 'cities', label: 'Cities', type: 'number', required: false, default: '25' },
      { name: 'rides', label: 'Rides', type: 'number', required: false, default: '8' },
    ],
  },
  LocationCard: {
    name: 'Location Card',
    icon: '📍',
    template: `<LocationCard 
  name="Location Name"
  coordinates={[11.8, 92.7]}
  date="2024-01-15"
  type="dive"
  narrative="Your narrative about this location..."
/>`,
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, default: 'Location Name' },
      { name: 'coordinates', label: 'Coordinates', type: 'text', required: false, default: '[11.8, 92.7]', hint: 'Format: [latitude, longitude]' },
      { name: 'date', label: 'Date', type: 'date', required: false, default: new Date().toISOString().split('T')[0] },
      { name: 'type', label: 'Type', type: 'select', required: false, default: 'dive', options: ['dive', 'ride', 'work', 'personal'] },
      { name: 'narrative', label: 'Narrative', type: 'textarea', required: false, default: 'Your narrative about this location...' },
    ],
  },
  StoryTimeline: {
    name: 'Story Timeline',
    icon: '📅',
    template: `<StoryTimeline>
  <TimelineEvent date="2024-01-15" location="Location 1">
    First event description
  </TimelineEvent>
  <TimelineEvent date="2024-01-16" location="Location 2">
    Second event description
  </TimelineEvent>
</StoryTimeline>`,
    fields: [
      { name: 'event1_date', label: 'Event 1 Date', type: 'date', required: true, default: new Date().toISOString().split('T')[0] },
      { name: 'event1_location', label: 'Event 1 Location', type: 'text', required: true, default: 'Location 1' },
      { name: 'event1_description', label: 'Event 1 Description', type: 'textarea', required: true, default: 'First event description' },
      { name: 'event2_date', label: 'Event 2 Date', type: 'date', required: false, default: '' },
      { name: 'event2_location', label: 'Event 2 Location', type: 'text', required: false, default: '' },
      { name: 'event2_description', label: 'Event 2 Description', type: 'textarea', required: false, default: '' },
    ],
  },
}

export function ComponentInsertModal({ componentType, onInsert, onClose }: ComponentInsertModalProps) {
  const component = componentTemplates[componentType]
  
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    if (!component) return {}
    const initial: Record<string, any> = {}
    component.fields.forEach((field: any) => {
      initial[field.name] = field.default || ''
    })
    return initial
  })

  if (!component) {
    return null
  }

  const handleSubmit = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    let code = component.template

    if (componentType === 'StoryTimeline') {
      const events = []
      if (formData.event1_date && formData.event1_location && formData.event1_description) {
        events.push({
          date: formData.event1_date,
          location: formData.event1_location,
          description: formData.event1_description,
        })
      }
      if (formData.event2_date && formData.event2_location && formData.event2_description) {
        events.push({
          date: formData.event2_date,
          location: formData.event2_location,
          description: formData.event2_description,
        })
      }
      
      if (events.length > 0) {
        const timelineEvents = events.map(
          (event) => `  <TimelineEvent date="${event.date}" location="${event.location}">
    ${event.description}
  </TimelineEvent>`
        ).join('\n')
        code = `<StoryTimeline>
${timelineEvents}
</StoryTimeline>`
      }
    } else {
      component.fields.forEach((field: any) => {
        const value = formData[field.name]
        if (value === undefined || value === '') {
          if (field.required) {
            return
          }
          if (field.type === 'number' || field.type === 'text' || field.type === 'select') {
            code = code.replace(new RegExp(`\\s+${field.name}=\\{[^}]+\\}`, 'g'), '')
            code = code.replace(new RegExp(`\\s+${field.name}="[^"]*"`, 'g'), '')
          }
          return
        }

        if (field.name === 'highlights' || field.name === 'stops') {
          const items = value.split(',').map((item: string) => item.trim()).filter(Boolean)
          code = code.replace(
            new RegExp(`(${field.name}=\\{)\\[[^\\]]+\\](\\})`, 'g'),
            `$1[${items.map((item: string) => `"${item}"`).join(', ')}]$2`
          )
        } else if (field.name === 'code') {
          const codeBlock = `{\`${value}\`}`
          code = code.replace(/\{`[^`]+`\}/s, codeBlock)
        } else if (field.type === 'number') {
          code = code.replace(new RegExp(`(${field.name}=\\{)[^}]+(\\})`, 'g'), `$1${value}$2`)
        } else if (field.type === 'textarea') {
          code = code.replace(new RegExp(`(${field.name}=")[^"]*(")`, 'g'), `$1${value}$2`)
        } else {
          code = code.replace(new RegExp(`(${field.name}=")[^"]*(")`, 'g'), `$1${value}$2`)
        }
      })
    }

    console.log('Inserting code:', code)
    onInsert(code)
    // Small delay before closing to ensure insertion happens
    setTimeout(() => {
      onClose()
    }, 50)
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div 
        className="bg-neutral-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-ocean-light">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{component.icon}</span>
              <h2 className="font-serif text-2xl text-ocean-deep heading-serif">{component.name}</h2>
            </div>
            <button
              onClick={onClose}
              className="text-ocean-light hover:text-ocean-deep transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {component.fields.map((field: any) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-ocean-deep mb-2">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  value={formData[field.name] || ''}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base font-mono text-sm"
                  rows={field.name === 'code' ? 8 : 4}
                  required={field.required}
                />
              ) : field.type === 'select' ? (
                <select
                  value={formData[field.name] || field.default}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                  required={field.required}
                >
                  {field.options.map((opt: string) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  value={formData[field.name] || ''}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                  placeholder={field.default}
                  required={field.required}
                />
              )}
              {field.hint && (
                <p className="text-xs text-ocean-light mt-1">{field.hint}</p>
              )}
            </div>
          ))}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2 bg-teal-base text-neutral-white rounded-lg font-medium hover:bg-teal-dark transition-colors"
            >
              Insert Component
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-ocean-light text-ocean-deep rounded-lg font-medium hover:bg-ocean-base transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


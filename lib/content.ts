import fs from 'fs'
import path from 'path'
import { WorkExperience, Skill, Course, LifeMoment } from '@/types'
import { HomeContent, getHomeContent } from './home'
import { db } from './db'

const contentDirectory = path.join(process.cwd(), 'content')
const useSupabase = process.env.USE_SUPABASE === 'true'

export async function getHomeContentData(): Promise<HomeContent> {
  return await getHomeContent()
}

export async function getWorkExperience(): Promise<WorkExperience[]> {
  if (useSupabase) {
    try {
      const content = await db.content.get('experience')
      if (content && Array.isArray(content)) {
        return content as WorkExperience[]
      }
    } catch (error) {
      console.error('Error fetching experience from Supabase:', error)
    }
  }

  const filePath = path.join(contentDirectory, 'experience.json')
  if (!fs.existsSync(filePath)) {
    return []
  }
  const fileContents = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(fileContents) as WorkExperience[]
}

export interface ExperiencePageContent {
  header: {
    title: string
    subtitle: string
  }
  stats: {
    yearsExperience: {
      value: string
      label: string
    }
    companies: {
      value: string | 'auto'
      label: string
    }
    technologies: {
      value: string
      label: string
    }
  }
  timeline: {
    title: string
    description: string
  }
  skills: {
    title: string
    description: string
  }
  cta: {
    title: string
    description: string
    primaryButton: {
      text: string
      href: string
    }
    secondaryButton: {
      text: string
      href: string
    }
  }
}

export async function getExperiencePageContent(): Promise<ExperiencePageContent> {
  if (useSupabase) {
    try {
      const content = await db.content.get('experience-page')
      if (content) {
        return content as ExperiencePageContent
      }
    } catch (error) {
      console.error('Error fetching experience-page from Supabase:', error)
    }
  }

  const filePath = path.join(contentDirectory, 'experience-page.json')
  if (!fs.existsSync(filePath)) {
    return {
      header: {
        title: 'Career Journey',
        subtitle: 'Building scalable systems, one impact at a time',
      },
      stats: {
        yearsExperience: {
          value: '4+',
          label: 'Years Experience',
        },
        companies: {
          value: 'auto',
          label: 'Companies',
        },
        technologies: {
          value: '10+',
          label: 'Technologies',
        },
      },
      timeline: {
        title: 'Work Timeline',
        description: 'A chronological journey through my career, showcasing impact and growth',
      },
      skills: {
        title: 'Technical Skills',
        description: 'Technologies and tools I work with, grouped by domain',
      },
      cta: {
        title: "Let's Work Together",
        description: "Interested in collaborating? I'm open to senior engineering roles, consulting, and technical mentorship.",
        primaryButton: {
          text: 'View Recruiter Summary',
          href: '/hire',
        },
        secondaryButton: {
          text: 'Get In Touch',
          href: '/contact',
        },
      },
    }
  }
  const fileContents = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(fileContents) as ExperiencePageContent
}

export async function getSkills(): Promise<Skill[]> {
  if (useSupabase) {
    try {
      const content = await db.content.get('skills')
      if (content && Array.isArray(content)) {
        return content as Skill[]
      }
    } catch (error) {
      console.error('Error fetching skills from Supabase:', error)
    }
  }

  const filePath = path.join(contentDirectory, 'skills.json')
  if (!fs.existsSync(filePath)) {
    return []
  }
  const fileContents = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(fileContents) as Skill[]
}

export async function getCourses(): Promise<Course[]> {
  if (useSupabase) {
    try {
      const content = await db.content.get('courses')
      if (content && Array.isArray(content)) {
        return content as Course[]
      }
    } catch (error) {
      console.error('Error fetching courses from Supabase:', error)
    }
  }

  const filePath = path.join(contentDirectory, 'courses.json')
  if (!fs.existsSync(filePath)) {
    return []
  }
  const fileContents = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(fileContents) as Course[]
}

export async function getLifeMoments(): Promise<LifeMoment[]> {
  if (useSupabase) {
    try {
      const content = await db.content.get('life')
      if (content && Array.isArray(content)) {
        const moments = content as LifeMoment[]
        return moments.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        })
      }
    } catch (error) {
      console.error('Error fetching life moments from Supabase:', error)
    }
  }

  const filePath = path.join(contentDirectory, 'life.json')
  if (!fs.existsSync(filePath)) {
    return []
  }
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const moments = JSON.parse(fileContents) as LifeMoment[]
  return moments.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}

export function getAboutContent(): string {
  const filePath = path.join(contentDirectory, 'about.md')
  if (!fs.existsSync(filePath)) {
    return ''
  }
  return fs.readFileSync(filePath, 'utf8')
}

export interface AboutTimelineEvent {
  year: string
  title: string
  description: string
  type?: 'career' | 'personal' | 'milestone' | 'philosophy'
  icon?: string
}

export async function getAboutTimeline(): Promise<AboutTimelineEvent[]> {
  if (useSupabase) {
    try {
      const content = await db.content.get('about-timeline')
      if (content && Array.isArray(content)) {
        return content as AboutTimelineEvent[]
      }
    } catch (error) {
      console.error('Error fetching about-timeline from Supabase:', error)
    }
  }

  const filePath = path.join(contentDirectory, 'about-timeline.json')
  if (fs.existsSync(filePath)) {
    const fileContents = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(fileContents) as AboutTimelineEvent[]
  }
  
  // Fallback: Parse from markdown or return default timeline
  return getDefaultAboutTimeline()
}

function getDefaultAboutTimeline(): AboutTimelineEvent[] {
  return [
    {
      year: '2020',
      title: 'Graduation',
      description: 'Graduated with B.Tech in Computer Science & Engineering from College of Technology & Engineering, Udaipur. Started my journey in Android development with a passion for creating intuitive mobile experiences.',
      type: 'milestone',
      icon: '🎓'
    },
    {
      year: '2021',
      title: 'Alyve Health - First Steps',
      description: 'Migrated legacy applications to modern MVVM architecture, reducing technical debt and setting the foundation for faster development cycles.',
      type: 'career',
      icon: '💼'
    },
    {
      year: '2021 - 2024',
      title: 'Delhivery - Building at Scale',
      description: 'Transformed internal tools into public-facing marketplaces, architected multi-app systems with offline-first capabilities, and built reusable component libraries. Contributed to Go microservices and event-driven architectures handling high-volume logistics workflows.',
      type: 'career',
      icon: '🚀'
    },
    {
      year: '2024 - Present',
      title: 'Velotio Technologies - Pushing Boundaries',
      description: 'Working on cutting-edge audio technology, building the DTS Play-Fi App that delivers premium wireless audio experiences across 17+ languages. Leading development of spatial computing applications for Android XR devices.',
      type: 'career',
      icon: '🎵'
    },
    {
      year: 'Ongoing',
      title: 'Life Beyond Code',
      description: 'Riding my BMW G 310 GS through mountains, traveling across India, writing poetry and tech blogs, staying fit, and planning scuba diving adventures. Life beyond code makes me a better engineer.',
      type: 'personal',
      icon: '🌊'
    },
    {
      year: 'Philosophy',
      title: 'Core Values',
      description: 'Building for scale with architecture that grows with the product. Offline-first thinking for seamless experiences. Code quality over velocity. Full-stack understanding. Continuous learning as technology evolves.',
      type: 'philosophy',
      icon: '💡'
    }
  ]
}



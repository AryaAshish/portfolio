import fs from 'fs'
import path from 'path'
import { WorkExperience, Skill, Course, LifeMoment } from '@/types'
import { HomeContent, getHomeContent } from './home'

const contentDirectory = path.join(process.cwd(), 'content')

export function getHomeContentData(): HomeContent {
  return getHomeContent()
}

export function getWorkExperience(): WorkExperience[] {
  const filePath = path.join(contentDirectory, 'experience.json')
  if (!fs.existsSync(filePath)) {
    return []
  }
  const fileContents = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(fileContents) as WorkExperience[]
}

export function getSkills(): Skill[] {
  const filePath = path.join(contentDirectory, 'skills.json')
  if (!fs.existsSync(filePath)) {
    return []
  }
  const fileContents = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(fileContents) as Skill[]
}

export function getCourses(): Course[] {
  const filePath = path.join(contentDirectory, 'courses.json')
  if (!fs.existsSync(filePath)) {
    return []
  }
  const fileContents = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(fileContents) as Course[]
}

export function getLifeMoments(): LifeMoment[] {
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

export function getAboutTimeline(): AboutTimelineEvent[] {
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



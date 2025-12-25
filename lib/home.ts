import fs from 'fs'
import path from 'path'

const homeFilePath = path.join(process.cwd(), 'content', 'home.json')

export interface HomeContent {
  hero: {
    title: string
    subtitle: string
    videoUrl?: string
    backgroundVideoUrl?: string
    backgroundImageUrl?: string
    coralImages?: Array<{
      url: string
      cropX?: number
      cropY?: number
      cropWidth?: number
      cropHeight?: number
    }>
    cta: {
      primary: { text: string; href: string }
      secondary: { text: string; href: string }
      tertiary: { text: string; href: string }
    }
  }
  whatImGoodAt: {
    title: string
    description: string
    items: Array<{ title: string; description: string }>
  }
  whatIDontOptimizeFor: {
    title: string
    description: string
    items: Array<{ title: string; description: string }>
  }
  hiring: {
    title: string
    roles: string[]
    teams: string[]
    cta: {
      primary: { text: string; href: string }
      secondary: { text: string; href: string }
    }
  }
}

export function getHomeContent(): HomeContent {
  if (!fs.existsSync(homeFilePath)) {
    return getDefaultHomeContent()
  }

  try {
    const fileContents = fs.readFileSync(homeFilePath, 'utf8')
    return JSON.parse(fileContents) as HomeContent
  } catch (error) {
    console.error('Error reading home content:', error)
    return getDefaultHomeContent()
  }
}

function getDefaultHomeContent(): HomeContent {
  return {
    hero: {
      title: "Engineer by craft.\nDiver by soul.\nRider by heart.",
      subtitle: "Android • Backend • Systems • Writing • Travel • Scuba • Motorcycles",
      cta: {
        primary: { text: "View My Work", href: "/experience" },
        secondary: { text: "Read My Writing", href: "/blog" },
        tertiary: { text: "Join the Newsletter", href: "/newsletter" },
      },
    },
    whatImGoodAt: {
      title: "What I'm Good At",
      description: "Building scalable Android applications, designing robust backend systems, and writing code that stands the test of time.",
      items: [
        {
          title: "Mobile Engineering",
          description: "Android development with Kotlin, Jetpack Compose, and modern architecture patterns. Focus on performance, accessibility, and user experience.",
        },
        {
          title: "Backend Systems",
          description: "Scalable APIs, microservices architecture, event-driven systems. Go, Node.js, Kafka, Redis. Systems that handle scale gracefully.",
        },
        {
          title: "Systems Thinking",
          description: "Architecture that scales, code that's maintainable, solutions that solve real problems. Clean code, clear patterns, thoughtful design.",
        },
      ],
    },
    whatIDontOptimizeFor: {
      title: "What I Don't Optimize For",
      description: "Maturity means knowing what not to chase. Here's what I skip.",
      items: [
        {
          title: "Buzzword Bingo",
          description: "I don't chase the latest framework just because it's trending. I choose tools that solve real problems.",
        },
        {
          title: "Over-Engineering",
          description: "Simple solutions first. Complexity only when necessary. YAGNI isn't just a principle—it's a discipline.",
        },
        {
          title: "Velocity Over Quality",
          description: "Fast is good, but sustainable is better. I optimize for long-term maintainability, not short-term metrics.",
        },
        {
          title: "Solo Heroics",
          description: "The best code is written by teams. I focus on collaboration, knowledge sharing, and building systems others can understand.",
        },
      ],
    },
    hiring: {
      title: "If You're Hiring",
      roles: [
        "Senior Android Engineer",
        "Backend Engineer (Go, Node.js)",
        "Full-Stack Engineer",
        "Systems Architect",
        "Engineering Lead (hands-on)",
      ],
      teams: [
        "Product-focused teams building real user value",
        "Teams that value code quality and maintainability",
        "Environments that encourage learning and growth",
        "Remote-first or hybrid cultures",
        "Startups to mid-size companies (50-500 people)",
      ],
      cta: {
        primary: { text: "View Experience", href: "/experience" },
        secondary: { text: "Get In Touch", href: "/contact" },
      },
    },
  }
}


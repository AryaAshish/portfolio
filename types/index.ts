export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  publishedAt: string
  readingTime: number
  tags: string[]
  category: string
  published: boolean
  content: string
  image?: string
  videoUrl?: string
}

export interface WorkExperience {
  company: string
  role: string
  period: string
  location?: string
  impact: string[]
  technologies: string[]
  metrics?: string[]
}

export interface Skill {
  category: string
  items: string[]
}

export interface Course {
  id: string
  title: string
  description: string
  modules: CourseModule[]
  status: 'coming-soon' | 'live' | 'draft'
  price?: number
  currency?: string
  thumbnail?: string
}

export interface CourseModule {
  title: string
  description: string
  lessons: string[]
}

export interface NewsletterSubscriber {
  email: string
  name?: string
  source?: string
}

export interface LifeMoment {
  id: string
  type: 'scuba' | 'motorcycle' | 'travel' | 'reflection'
  title: string
  description: string
  date: string
  location?: string
  image?: string
  videoUrl?: string
}

export interface ContactFormData {
  name: string
  email: string
  message: string
  purpose: 'hiring' | 'collaboration' | 'general'
}

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  startDate: string
  endDate?: string
  allDay: boolean
  eventType: 'event' | 'meeting' | 'deadline' | 'reminder' | 'task'
  color: string
  location?: string
  recurringPattern?: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'
  recurringUntil?: string
  createdAt: string
  updatedAt: string
}

export interface JournalEntry {
  id: string
  date: string
  title?: string
  content: string
  mood?: 'happy' | 'sad' | 'neutral' | 'excited' | 'anxious' | 'calm' | 'frustrated' | 'grateful'
  tags: string[]
  weather?: string
  location?: string
  createdAt: string
  updatedAt: string
}

export interface FinanceTransaction {
  id: string
  date: string
  type: 'income' | 'expense' | 'transfer'
  category: string
  amount: number
  description?: string
  paymentMethod?: 'cash' | 'card' | 'bank_transfer' | 'upi'
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface ImportantItem {
  id: string
  title: string
  description?: string
  type: 'note' | 'todo' | 'reminder' | 'goal' | 'idea'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'active' | 'completed' | 'archived'
  dueDate?: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface FinanceAnalytics {
  totalIncome: number
  totalExpenses: number
  netAmount: number
  categoryBreakdown: { category: string; amount: number }[]
  monthlyTrend: { month: string; income: number; expenses: number }[]
}

export interface HirePageContent {
  hero: {
    title: string
    subtitle: string
  }
  summary: {
    yearsOfExperience: number
    currentRole?: string
    location: string
    availability: string
  }
  cta: {
    title: string
    description: string
  }
  contact: {
    email: string
    phone: string
    location: string
  }
  resumeUrl?: string
}

export interface SocialPost {
  id: string
  platform: 'youtube' | 'instagram'
  externalId: string
  title: string
  description?: string
  thumbnailUrl: string
  url: string
  publishedAt: string
  metadata?: Record<string, any>
  cachedAt: string
}

export interface YouTubeVideo {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  publishedAt: string
  videoId: string
  channelId: string
  viewCount?: number
  duration?: string
}

export interface InstagramPost {
  id: string
  caption?: string
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  mediaUrl: string
  thumbnailUrl?: string
  permalink: string
  timestamp: string
  likeCount?: number
  commentsCount?: number
}



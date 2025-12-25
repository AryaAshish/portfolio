export interface BlogPost {
  slug: string
  title: string
  description: string
  content: string
  date: string
  publishedAt: string
  readingTime: number
  tags: string[]
  category: string
  published: boolean
  image?: string
  videoUrl?: string
}

export interface WorkExperience {
  id: string
  company: string
  role: string
  period: string
  location: string
  description: string
  achievements: string[]
  technologies: string[]
  type: 'full-time' | 'contract' | 'freelance' | 'internship'
}

export interface Skill {
  name: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  category: string
  yearsOfExperience?: number
}

export interface Course {
  id: string
  title: string
  description: string
  duration: string
  level: 'beginner' | 'intermediate' | 'advanced'
  price?: number
  currency?: string
  image?: string
  url?: string
  published: boolean
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
  type: 'note' | 'task' | 'reminder' | 'goal' | 'idea'
  priority: 'low' | 'medium' | 'high'
  status: 'active' | 'completed' | 'archived'
  dueDate?: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface FinanceAnalytics {
  totalIncome: number
  totalExpenses: number
  balance: number
  incomeByCategory: Record<string, number>
  expensesByCategory: Record<string, number>
  monthlyTrend: Array<{ month: string; income: number; expenses: number }>
}

export interface NewsletterSubscriber {
  email: string
  name?: string
  source?: string
}

export interface PrepPath {
  id: string
  title: string
  description: string
  icon?: string
  color: string
  category: 'android' | 'system-design' | 'dsa' | 'frontend' | 'backend' | 'devops' | 'other'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime?: string
  published: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export interface PrepTopic {
  id: string
  prepPathId: string
  title: string
  description?: string
  order: number
  createdAt: string
  updatedAt: string
}

export interface PrepQuestion {
  id: string
  prepTopicId: string
  question: string
  answer?: string
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
  relatedBlogPost?: string
  order: number
  createdAt: string
  updatedAt: string
}

export interface PrepResource {
  id: string
  prepPathId?: string
  prepTopicId?: string
  title: string
  type: 'blog' | 'video' | 'documentation' | 'book' | 'course' | 'practice'
  url: string
  description?: string
  author?: string
  order: number
  createdAt: string
  updatedAt: string
}

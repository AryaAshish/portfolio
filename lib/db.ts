import { supabase, supabaseAdmin } from './supabase'
import { BlogPost, WorkExperience, Skill, Course, LifeMoment, NewsletterSubscriber, CalendarEvent, JournalEntry, FinanceTransaction, ImportantItem, FinanceAnalytics } from '@/types'
import { HomeContent } from './home'
import readingTime from 'reading-time'

const useSupabase = process.env.USE_SUPABASE === 'true' && supabaseAdmin !== null

export const db = {
  blog: {
    async getAll(): Promise<BlogPost[]> {
      if (!useSupabase) return []
      
      const { data, error } = await supabaseAdmin!
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false })
      
      if (error) throw error
      
      return (data || []).map((post: any) => {
        const readingTimeResult = readingTime(post.content || '')
        const dateValue = post.date || post.published_at || new Date().toISOString()
        return {
          slug: post.slug,
          title: post.title,
          description: post.description,
          content: post.content,
          tags: post.tags || [],
          category: post.category || 'general',
          published: post.published,
          date: dateValue,
          publishedAt: post.published_at || dateValue,
          readingTime: Math.ceil(readingTimeResult.minutes),
          image: post.image || undefined,
          videoUrl: post.video_url || undefined,
        }
      })
    },

    async getBySlug(slug: string): Promise<BlogPost | null> {
      if (!useSupabase) return null
      
      const { data, error } = await supabaseAdmin!
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single()
      
      if (error || !data) return null
      
      const readingTimeResult = readingTime(data.content || '')
      const dateValue = data.date || data.published_at || new Date().toISOString()
      return {
        slug: data.slug,
        title: data.title,
        description: data.description,
        content: data.content,
        tags: data.tags || [],
        category: data.category || 'general',
        published: data.published,
        date: dateValue,
        publishedAt: data.published_at || dateValue,
        readingTime: Math.ceil(readingTimeResult.minutes),
        image: data.image || undefined,
        videoUrl: data.video_url || undefined,
      }
    },

    async create(post: Omit<BlogPost, 'readingTime'>): Promise<BlogPost> {
      if (!useSupabase) throw new Error('Supabase not configured')
      
      const { data, error } = await supabaseAdmin!
        .from('blog_posts')
        .insert({
          slug: post.slug,
          title: post.title,
          description: post.description,
          content: post.content,
          tags: post.tags || [],
          category: post.category || 'general',
          published: post.published ?? false,
          published_at: post.publishedAt || new Date().toISOString(),
          image: post.image || null,
          video_url: post.videoUrl || null,
        })
        .select()
        .single()
      
      if (error) throw error
      
      const readingTimeResult = readingTime(data.content || '')
      const dateValue = data.date || data.published_at || new Date().toISOString()
      return {
        slug: data.slug,
        title: data.title,
        description: data.description,
        content: data.content,
        tags: data.tags || [],
        category: data.category || 'general',
        published: data.published,
        date: dateValue,
        publishedAt: data.published_at || dateValue,
        readingTime: Math.ceil(readingTimeResult.minutes),
        image: data.image || undefined,
        videoUrl: data.video_url || undefined,
      }
    },

    async update(slug: string, post: Partial<Omit<BlogPost, 'slug' | 'readingTime'>>): Promise<BlogPost> {
      if (!useSupabase) throw new Error('Supabase not configured')
      
      const { data, error } = await supabaseAdmin!
        .from('blog_posts')
        .update({
          title: post.title,
          description: post.description,
          content: post.content,
          tags: post.tags,
          category: post.category,
          published: post.published,
          published_at: post.publishedAt,
          image: post.image !== undefined ? post.image : undefined,
          video_url: post.videoUrl !== undefined ? post.videoUrl : undefined,
        })
        .eq('slug', slug)
        .select()
        .single()
      
      if (error) throw error
      
      const readingTimeResult = readingTime(data.content || '')
      const dateValue = data.date || data.published_at || new Date().toISOString()
      return {
        slug: data.slug,
        title: data.title,
        description: data.description,
        content: data.content,
        tags: data.tags || [],
        category: data.category || 'general',
        published: data.published,
        date: dateValue,
        publishedAt: data.published_at || dateValue,
        readingTime: Math.ceil(readingTimeResult.minutes),
        image: data.image || undefined,
        videoUrl: data.video_url || undefined,
      }
    },

    async delete(slug: string): Promise<void> {
      if (!useSupabase) throw new Error('Supabase not configured')
      
      const { error } = await supabaseAdmin!
        .from('blog_posts')
        .delete()
        .eq('slug', slug)
      
      if (error) throw error
    },
  },

  content: {
    async get(pageType: string): Promise<any> {
      if (!useSupabase) return null
      
      const { data, error } = await supabaseAdmin!
        .from('content_pages')
        .select('content')
        .eq('page_type', pageType)
        .single()
      
      if (error || !data) return null
      
      return data.content
    },

    async set(pageType: string, content: any): Promise<void> {
      if (!useSupabase) throw new Error('Supabase not configured')
      
      const { error } = await supabaseAdmin!
        .from('content_pages')
        .upsert({
          page_type: pageType,
          content: content,
        }, {
          onConflict: 'page_type',
        })
      
      if (error) throw error
    },
  },

  subscribers: {
    async getAll(): Promise<NewsletterSubscriber[]> {
      if (!useSupabase) return []
      
      const { data, error } = await supabaseAdmin!
        .from('newsletter_subscribers')
        .select('*')
        .is('unsubscribed_at', null)
        .order('subscribed_at', { ascending: false })
      
      if (error) throw error
      
      return (data || []).map((sub: any) => ({
        email: sub.email,
        name: sub.name,
        source: sub.source,
      }))
    },

    async create(subscriber: NewsletterSubscriber): Promise<void> {
      if (!useSupabase) throw new Error('Supabase not configured')
      
      const { error } = await supabaseAdmin!
        .from('newsletter_subscribers')
        .insert({
          email: subscriber.email,
          name: subscriber.name,
          source: subscriber.source,
        })
      
      if (error) throw error
    },
  },

  planner: {
    calendar: {
      async getAll(startDate?: string, endDate?: string): Promise<CalendarEvent[]> {
        if (!useSupabase) return []
        
        let query = supabaseAdmin!.from('calendar_events').select('*')
        
        if (startDate) {
          query = query.gte('start_date', startDate)
        }
        if (endDate) {
          query = query.lte('start_date', endDate)
        }
        
        const { data, error } = await query.order('start_date', { ascending: true })
        
        if (error) throw error
        
        return (data || []).map((event: any) => ({
          id: event.id,
          title: event.title,
          description: event.description,
          startDate: event.start_date,
          endDate: event.end_date,
          allDay: event.all_day,
          eventType: event.event_type,
          color: event.color,
          location: event.location,
          recurringPattern: event.recurring_pattern,
          recurringUntil: event.recurring_until,
          createdAt: event.created_at,
          updatedAt: event.updated_at,
        }))
      },

      async getById(id: string): Promise<CalendarEvent | null> {
        if (!useSupabase) return null
        
        const { data, error } = await supabaseAdmin!
          .from('calendar_events')
          .select('*')
          .eq('id', id)
          .single()
        
        if (error || !data) return null
        
        return {
          id: data.id,
          title: data.title,
          description: data.description,
          startDate: data.start_date,
          endDate: data.end_date,
          allDay: data.all_day,
          eventType: data.event_type,
          color: data.color,
          location: data.location,
          recurringPattern: data.recurring_pattern,
          recurringUntil: data.recurring_until,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        }
      },

      async create(event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>): Promise<CalendarEvent> {
        if (!useSupabase) throw new Error('Supabase not configured')
        
        const { data, error } = await supabaseAdmin!
          .from('calendar_events')
          .insert({
            title: event.title,
            description: event.description,
            start_date: event.startDate,
            end_date: event.endDate,
            all_day: event.allDay,
            event_type: event.eventType,
            color: event.color,
            location: event.location,
            recurring_pattern: event.recurringPattern || 'none',
            recurring_until: event.recurringUntil,
          })
          .select()
          .single()
        
        if (error) throw error
        
        return {
          id: data.id,
          title: data.title,
          description: data.description,
          startDate: data.start_date,
          endDate: data.end_date,
          allDay: data.all_day,
          eventType: data.event_type,
          color: data.color,
          location: data.location,
          recurringPattern: data.recurring_pattern,
          recurringUntil: data.recurring_until,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        }
      },

      async update(id: string, event: Partial<Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>>): Promise<CalendarEvent> {
        if (!useSupabase) throw new Error('Supabase not configured')
        
        const updateData: any = {}
        if (event.title !== undefined) updateData.title = event.title
        if (event.description !== undefined) updateData.description = event.description
        if (event.startDate !== undefined) updateData.start_date = event.startDate
        if (event.endDate !== undefined) updateData.end_date = event.endDate
        if (event.allDay !== undefined) updateData.all_day = event.allDay
        if (event.eventType !== undefined) updateData.event_type = event.eventType
        if (event.color !== undefined) updateData.color = event.color
        if (event.location !== undefined) updateData.location = event.location
        if (event.recurringPattern !== undefined) updateData.recurring_pattern = event.recurringPattern
        if (event.recurringUntil !== undefined) updateData.recurring_until = event.recurringUntil
        
        const { data, error } = await supabaseAdmin!
          .from('calendar_events')
          .update(updateData)
          .eq('id', id)
          .select()
          .single()
        
        if (error) throw error
        
        return {
          id: data.id,
          title: data.title,
          description: data.description,
          startDate: data.start_date,
          endDate: data.end_date,
          allDay: data.all_day,
          eventType: data.event_type,
          color: data.color,
          location: data.location,
          recurringPattern: data.recurring_pattern,
          recurringUntil: data.recurring_until,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        }
      },

      async delete(id: string): Promise<void> {
        if (!useSupabase) throw new Error('Supabase not configured')
        
        const { error } = await supabaseAdmin!
          .from('calendar_events')
          .delete()
          .eq('id', id)
        
        if (error) throw error
      },
    },

    journal: {
      async getAll(startDate?: string, endDate?: string): Promise<JournalEntry[]> {
        if (!useSupabase) return []
        
        let query = supabaseAdmin!.from('journal_entries').select('*')
        
        if (startDate) {
          query = query.gte('date', startDate)
        }
        if (endDate) {
          query = query.lte('date', endDate)
        }
        
        const { data, error } = await query.order('date', { ascending: false })
        
        if (error) throw error
        
        return (data || []).map((entry: any) => ({
          id: entry.id,
          date: entry.date,
          title: entry.title,
          content: entry.content,
          mood: entry.mood,
          tags: entry.tags || [],
          weather: entry.weather,
          location: entry.location,
          createdAt: entry.created_at,
          updatedAt: entry.updated_at,
        }))
      },

      async getByDate(date: string): Promise<JournalEntry | null> {
        if (!useSupabase) return null
        
        const { data, error } = await supabaseAdmin!
          .from('journal_entries')
          .select('*')
          .eq('date', date)
          .single()
        
        if (error || !data) return null
        
        return {
          id: data.id,
          date: data.date,
          title: data.title,
          content: data.content,
          mood: data.mood,
          tags: data.tags || [],
          weather: data.weather,
          location: data.location,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        }
      },

      async getById(id: string): Promise<JournalEntry | null> {
        if (!useSupabase) return null
        
        const { data, error } = await supabaseAdmin!
          .from('journal_entries')
          .select('*')
          .eq('id', id)
          .single()
        
        if (error || !data) return null
        
        return {
          id: data.id,
          date: data.date,
          title: data.title,
          content: data.content,
          mood: data.mood,
          tags: data.tags || [],
          weather: data.weather,
          location: data.location,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        }
      },

      async create(entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<JournalEntry> {
        if (!useSupabase) throw new Error('Supabase not configured')
        
        const { data, error } = await supabaseAdmin!
          .from('journal_entries')
          .insert({
            date: entry.date,
            title: entry.title,
            content: entry.content,
            mood: entry.mood,
            tags: entry.tags || [],
            weather: entry.weather,
            location: entry.location,
          })
          .select()
          .single()
        
        if (error) throw error
        
        return {
          id: data.id,
          date: data.date,
          title: data.title,
          content: data.content,
          mood: data.mood,
          tags: data.tags || [],
          weather: data.weather,
          location: data.location,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        }
      },

      async update(id: string, entry: Partial<Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>>): Promise<JournalEntry> {
        if (!useSupabase) throw new Error('Supabase not configured')
        
        const updateData: any = {}
        if (entry.date !== undefined) updateData.date = entry.date
        if (entry.title !== undefined) updateData.title = entry.title
        if (entry.content !== undefined) updateData.content = entry.content
        if (entry.mood !== undefined) updateData.mood = entry.mood
        if (entry.tags !== undefined) updateData.tags = entry.tags
        if (entry.weather !== undefined) updateData.weather = entry.weather
        if (entry.location !== undefined) updateData.location = entry.location
        
        const { data, error } = await supabaseAdmin!
          .from('journal_entries')
          .update(updateData)
          .eq('id', id)
          .select()
          .single()
        
        if (error) throw error
        
        return {
          id: data.id,
          date: data.date,
          title: data.title,
          content: data.content,
          mood: data.mood,
          tags: data.tags || [],
          weather: data.weather,
          location: data.location,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        }
      },

      async delete(id: string): Promise<void> {
        if (!useSupabase) throw new Error('Supabase not configured')
        
        const { error } = await supabaseAdmin!
          .from('journal_entries')
          .delete()
          .eq('id', id)
        
        if (error) throw error
      },
    },

    finances: {
      async getAll(filters?: { startDate?: string; endDate?: string; type?: string; category?: string }): Promise<FinanceTransaction[]> {
        if (!useSupabase) return []
        
        let query = supabaseAdmin!.from('finance_transactions').select('*')
        
        if (filters?.startDate) {
          query = query.gte('date', filters.startDate)
        }
        if (filters?.endDate) {
          query = query.lte('date', filters.endDate)
        }
        if (filters?.type) {
          query = query.eq('type', filters.type)
        }
        if (filters?.category) {
          query = query.eq('category', filters.category)
        }
        
        const { data, error } = await query.order('date', { ascending: false })
        
        if (error) throw error
        
        return (data || []).map((tx: any) => ({
          id: tx.id,
          date: tx.date,
          type: tx.type,
          category: tx.category,
          amount: parseFloat(tx.amount),
          description: tx.description,
          paymentMethod: tx.payment_method,
          tags: tx.tags || [],
          createdAt: tx.created_at,
          updatedAt: tx.updated_at,
        }))
      },

      async getById(id: string): Promise<FinanceTransaction | null> {
        if (!useSupabase) return null
        
        const { data, error } = await supabaseAdmin!
          .from('finance_transactions')
          .select('*')
          .eq('id', id)
          .single()
        
        if (error || !data) return null
        
        return {
          id: data.id,
          date: data.date,
          type: data.type,
          category: data.category,
          amount: parseFloat(data.amount),
          description: data.description,
          paymentMethod: data.payment_method,
          tags: data.tags || [],
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        }
      },

      async create(transaction: Omit<FinanceTransaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<FinanceTransaction> {
        if (!useSupabase) throw new Error('Supabase not configured')
        
        const { data, error } = await supabaseAdmin!
          .from('finance_transactions')
          .insert({
            date: transaction.date,
            type: transaction.type,
            category: transaction.category,
            amount: transaction.amount,
            description: transaction.description,
            payment_method: transaction.paymentMethod,
            tags: transaction.tags || [],
          })
          .select()
          .single()
        
        if (error) throw error
        
        return {
          id: data.id,
          date: data.date,
          type: data.type,
          category: data.category,
          amount: parseFloat(data.amount),
          description: data.description,
          paymentMethod: data.payment_method,
          tags: data.tags || [],
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        }
      },

      async update(id: string, transaction: Partial<Omit<FinanceTransaction, 'id' | 'createdAt' | 'updatedAt'>>): Promise<FinanceTransaction> {
        if (!useSupabase) throw new Error('Supabase not configured')
        
        const updateData: any = {}
        if (transaction.date !== undefined) updateData.date = transaction.date
        if (transaction.type !== undefined) updateData.type = transaction.type
        if (transaction.category !== undefined) updateData.category = transaction.category
        if (transaction.amount !== undefined) updateData.amount = transaction.amount
        if (transaction.description !== undefined) updateData.description = transaction.description
        if (transaction.paymentMethod !== undefined) updateData.payment_method = transaction.paymentMethod
        if (transaction.tags !== undefined) updateData.tags = transaction.tags
        
        const { data, error } = await supabaseAdmin!
          .from('finance_transactions')
          .update(updateData)
          .eq('id', id)
          .select()
          .single()
        
        if (error) throw error
        
        return {
          id: data.id,
          date: data.date,
          type: data.type,
          category: data.category,
          amount: parseFloat(data.amount),
          description: data.description,
          paymentMethod: data.payment_method,
          tags: data.tags || [],
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        }
      },

      async delete(id: string): Promise<void> {
        if (!useSupabase) throw new Error('Supabase not configured')
        
        const { error } = await supabaseAdmin!
          .from('finance_transactions')
          .delete()
          .eq('id', id)
        
        if (error) throw error
      },

      async getAnalytics(startDate: string, endDate: string): Promise<FinanceAnalytics> {
        if (!useSupabase) throw new Error('Supabase not configured')
        
        const { data, error } = await supabaseAdmin!
          .from('finance_transactions')
          .select('*')
          .gte('date', startDate)
          .lte('date', endDate)
        
        if (error) throw error
        
        const transactions = (data || []).map((tx: any) => ({
          type: tx.type,
          category: tx.category,
          amount: parseFloat(tx.amount),
          date: tx.date,
        }))
        
        const totalIncome = transactions
          .filter(tx => tx.type === 'income')
          .reduce((sum, tx) => sum + tx.amount, 0)
        
        const totalExpenses = transactions
          .filter(tx => tx.type === 'expense')
          .reduce((sum, tx) => sum + tx.amount, 0)
        
        const categoryBreakdown: { [key: string]: number } = {}
        transactions
          .filter(tx => tx.type === 'expense')
          .forEach(tx => {
            categoryBreakdown[tx.category] = (categoryBreakdown[tx.category] || 0) + tx.amount
          })
        
        const monthlyTrend: { [key: string]: { month: string; income: number; expenses: number } } = {}
        transactions.forEach(tx => {
          const month = tx.date.substring(0, 7)
          if (!monthlyTrend[month]) {
            monthlyTrend[month] = { month, income: 0, expenses: 0 }
          }
          if (tx.type === 'income') {
            monthlyTrend[month].income += tx.amount
          } else if (tx.type === 'expense') {
            monthlyTrend[month].expenses += tx.amount
          }
        })
        
        return {
          totalIncome,
          totalExpenses,
          netAmount: totalIncome - totalExpenses,
          categoryBreakdown: Object.entries(categoryBreakdown).map(([category, amount]) => ({ category, amount })),
          monthlyTrend: Object.values(monthlyTrend).sort((a, b) => a.month.localeCompare(b.month)),
        }
      },
    },

    items: {
      async getAll(filters?: { status?: string; priority?: string; type?: string }): Promise<ImportantItem[]> {
        if (!useSupabase) return []
        
        let query = supabaseAdmin!.from('important_items').select('*')
        
        if (filters?.status) {
          query = query.eq('status', filters.status)
        }
        if (filters?.priority) {
          query = query.eq('priority', filters.priority)
        }
        if (filters?.type) {
          query = query.eq('type', filters.type)
        }
        
        const { data, error } = await query.order('created_at', { ascending: false })
        
        if (error) throw error
        
        return (data || []).map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          type: item.type,
          priority: item.priority,
          status: item.status,
          dueDate: item.due_date,
          tags: item.tags || [],
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        }))
      },

      async getById(id: string): Promise<ImportantItem | null> {
        if (!useSupabase) return null
        
        const { data, error } = await supabaseAdmin!
          .from('important_items')
          .select('*')
          .eq('id', id)
          .single()
        
        if (error || !data) return null
        
        return {
          id: data.id,
          title: data.title,
          description: data.description,
          type: data.type,
          priority: data.priority,
          status: data.status,
          dueDate: data.due_date,
          tags: data.tags || [],
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        }
      },

      async create(item: Omit<ImportantItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ImportantItem> {
        if (!useSupabase) throw new Error('Supabase not configured')
        
        const { data, error } = await supabaseAdmin!
          .from('important_items')
          .insert({
            title: item.title,
            description: item.description,
            type: item.type,
            priority: item.priority,
            status: item.status,
            due_date: item.dueDate,
            tags: item.tags || [],
          })
          .select()
          .single()
        
        if (error) throw error
        
        return {
          id: data.id,
          title: data.title,
          description: data.description,
          type: data.type,
          priority: data.priority,
          status: data.status,
          dueDate: data.due_date,
          tags: data.tags || [],
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        }
      },

      async update(id: string, item: Partial<Omit<ImportantItem, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ImportantItem> {
        if (!useSupabase) throw new Error('Supabase not configured')
        
        const updateData: any = {}
        if (item.title !== undefined) updateData.title = item.title
        if (item.description !== undefined) updateData.description = item.description
        if (item.type !== undefined) updateData.type = item.type
        if (item.priority !== undefined) updateData.priority = item.priority
        if (item.status !== undefined) updateData.status = item.status
        if (item.dueDate !== undefined) updateData.due_date = item.dueDate
        if (item.tags !== undefined) updateData.tags = item.tags
        
        const { data, error } = await supabaseAdmin!
          .from('important_items')
          .update(updateData)
          .eq('id', id)
          .select()
          .single()
        
        if (error) throw error
        
        return {
          id: data.id,
          title: data.title,
          description: data.description,
          type: data.type,
          priority: data.priority,
          status: data.status,
          dueDate: data.due_date,
          tags: data.tags || [],
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        }
      },

      async delete(id: string): Promise<void> {
        if (!useSupabase) throw new Error('Supabase not configured')
        
        const { error } = await supabaseAdmin!
          .from('important_items')
          .delete()
          .eq('id', id)
        
        if (error) throw error
      },
    },
  },
}


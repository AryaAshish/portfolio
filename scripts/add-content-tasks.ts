import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseUrl || !supabaseServiceKey || supabaseServiceKey.includes('your_')) {
  console.error('❌ Supabase environment variables not properly configured!')
  console.error('   Please check your .env.local file')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

interface TaskInput {
  systemName: string
  title: string
  description?: string
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom'
  defaultPoints: number
  isOptional: boolean
  autoGenerate: boolean
  startDate: string
  endDate?: string | null
}

const contentTasks: TaskInput[] = [
  {
    systemName: "Content",
    title: "Capture Raw Thought",
    description: "Write one raw thought, observation, or question from the day (no editing)",
    frequency: "daily",
    defaultPoints: 3,
    isOptional: true,
    autoGenerate: true,
    startDate: "2026-01-01",
    endDate: "2026-12-31"
  },
  {
    systemName: "Content",
    title: "Weekly Reflection Draft",
    description: "Turn one raw thought into a structured reflection or post draft",
    frequency: "weekly",
    defaultPoints: 10,
    isOptional: false,
    autoGenerate: true,
    startDate: "2026-01-01",
    endDate: "2026-12-31"
  },
  {
    systemName: "Content",
    title: "Publish Weekly Post",
    description: "Publish one post (LinkedIn or Instagram) and log off",
    frequency: "weekly",
    defaultPoints: 15,
    isOptional: false,
    autoGenerate: true,
    startDate: "2026-01-01",
    endDate: "2026-12-31"
  },
  {
    systemName: "Content",
    title: "Cross-Post Content",
    description: "Repurpose the same idea across platforms (no rewriting)",
    frequency: "weekly",
    defaultPoints: 5,
    isOptional: true,
    autoGenerate: true,
    startDate: "2026-01-01",
    endDate: "2026-12-31"
  },
  {
    systemName: "Content",
    title: "Monthly Content Review",
    description: "Review what you posted, what felt honest, and what to continue",
    frequency: "monthly",
    defaultPoints: 10,
    isOptional: false,
    autoGenerate: true,
    startDate: "2026-01-01",
    endDate: "2026-12-31"
  },
  {
    systemName: "Content",
    title: "Audience Signal Check",
    description: "Notice replies, DMs, or conversations sparked",
    frequency: "monthly",
    defaultPoints: 5,
    isOptional: true,
    autoGenerate: true,
    startDate: "2026-01-01",
    endDate: "2026-12-31"
  }
]

const db = {
  systems: {
    async getAll() {
      const { data, error } = await supabaseAdmin
        .from('life_systems')
        .select('*')
        .eq('is_active', true)
        .order('name')
      if (error) throw error
      return data || []
    },
  },
  tasks: {
    async create(task: any) {
      const { data, error } = await supabaseAdmin
        .from('system_tasks')
        .insert({
          life_system_id: task.lifeSystemId,
          title: task.title,
          description: task.description,
          frequency: task.frequency,
          default_points: task.defaultPoints,
          is_optional: task.isOptional,
          auto_generate: task.autoGenerate,
          start_date: task.startDate,
          end_date: task.endDate,
        })
        .select(`
          *,
          life_systems (*)
        `)
        .single()
      if (error) throw error
      return {
        id: data.id,
        lifeSystemId: data.life_system_id,
        title: data.title,
        description: data.description,
        frequency: data.frequency,
        defaultPoints: data.default_points,
        isOptional: data.is_optional,
        autoGenerate: data.auto_generate,
        startDate: data.start_date,
        endDate: data.end_date,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        lifeSystem: data.life_systems ? {
          id: data.life_systems.id,
          name: data.life_systems.name,
        } : undefined,
      }
    },
  },
}

async function loadTasks(tasks: TaskInput[], systemName: string) {
  try {
    console.log(`\n📖 Loading ${systemName} tasks...`)
    console.log(`Found ${tasks.length} tasks to create\n`)
    
    const systems = await db.systems.getAll()
    const system = systems.find((s: any) => s.name.toLowerCase() === systemName.toLowerCase())
    
    if (!system) {
      throw new Error(`${systemName} system not found. Please run "npm run init:life-os" first.`)
    }
    
    const createdTasks = []
    const errors = []
    
    for (const taskInput of tasks) {
      try {
        console.log(`Creating task: ${taskInput.title}...`)
        
        const task = await db.tasks.create({
          lifeSystemId: system.id,
          title: taskInput.title,
          description: taskInput.description,
          frequency: taskInput.frequency,
          defaultPoints: taskInput.defaultPoints,
          isOptional: taskInput.isOptional,
          autoGenerate: taskInput.autoGenerate,
          startDate: taskInput.startDate,
          endDate: taskInput.endDate || undefined,
        })
        
        console.log(`  ✓ Created task: ${task.title} (ID: ${task.id})`)
        console.log(`    Frequency: ${task.frequency}, Points: ${task.defaultPoints}${task.isOptional ? ' (Optional)' : ''}`)
        if (task.endDate) {
          console.log(`    Active: ${task.startDate} to ${task.endDate}`)
        } else {
          console.log(`    Active: ${task.startDate} onwards`)
        }
        
        createdTasks.push(task)
        console.log('')
      } catch (error: any) {
        console.error(`  ✗ Failed to create task "${taskInput.title}": ${error.message}\n`)
        errors.push({ task: taskInput.title, error: error.message })
      }
    }
    
    console.log(`\n📊 ${systemName} Summary:`)
    console.log(`  ✅ Successfully created: ${createdTasks.length} tasks`)
    console.log(`  ❌ Failed: ${errors.length} tasks`)
    
    if (errors.length > 0) {
      console.log(`\n❌ Errors:`)
      errors.forEach(({ task, error }) => {
        console.log(`  - ${task}: ${error}`)
      })
    }
    
    return { createdTasks, errors }
  } catch (error: any) {
    console.error(`Error loading ${systemName} tasks:`, error.message)
    throw error
  }
}

async function main() {
  try {
    console.log('🚀 Starting Content tasks import...\n')
    console.log('='.repeat(60))
    
    await loadTasks(contentTasks, 'Content')
    
    console.log('')
    console.log('='.repeat(60))
    console.log('✅ Content tasks import completed!')
    console.log('\n💡 Note: Task instances will be generated on-demand (virtual instances)')
    console.log('   when you view dates in the planner. No bulk generation needed!')
  } catch (error: any) {
    console.error('\n❌ Import failed:', error.message)
    process.exit(1)
  }
}

main()


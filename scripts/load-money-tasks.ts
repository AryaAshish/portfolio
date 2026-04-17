import { config } from 'dotenv'
import { resolve } from 'path'
import { readFileSync } from 'fs'
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
    async getAll() {
      const { data, error } = await supabaseAdmin
        .from('system_tasks')
        .select('*')
        .order('created_at')
      if (error) throw error
      return data || []
    },
    async delete(id: string) {
      const { error } = await supabaseAdmin
        .from('system_tasks')
        .delete()
        .eq('id', id)
      if (error) throw error
    },
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

async function clearAllTasks() {
  console.log('🗑️  Clearing all existing tasks and instances...')
  
  try {
    const allTasks = await db.tasks.getAll()
    console.log(`Found ${allTasks.length} existing tasks`)
    
    if (allTasks.length === 0) {
      console.log('No tasks to delete.\n')
      return
    }
    
    let deletedCount = 0
    for (const task of allTasks) {
      try {
        await db.tasks.delete(task.id)
        deletedCount++
        console.log(`  ✓ Deleted task: ${task.title}`)
      } catch (error: any) {
        console.error(`  ✗ Failed to delete task ${task.title}:`, error.message)
      }
    }
    
    console.log(`✅ Deleted ${deletedCount} tasks (instances are automatically deleted via database cascade)\n`)
  } catch (error: any) {
    console.error('Error clearing tasks:', error.message)
    throw error
  }
}

async function loadMoneyTasks(filePath: string) {
  try {
    console.log(`📖 Reading tasks from ${filePath}...`)
    const fileContent = readFileSync(filePath, 'utf-8')
    const allTasks: TaskInput[] = JSON.parse(fileContent)
    
    const moneyTasks = allTasks.filter(task => task.systemName.toLowerCase() === 'money')
    
    console.log(`Found ${moneyTasks.length} money tasks to create\n`)
    
    if (moneyTasks.length === 0) {
      console.log('⚠️  No money tasks found in the file!')
      return
    }
    
    const systems = await db.systems.getAll()
    const moneySystem = systems.find((s: any) => s.name.toLowerCase() === 'money')
    
    if (!moneySystem) {
      throw new Error('Money system not found. Please run "npm run init:life-os" first.')
    }
    
    const createdTasks = []
    const errors = []
    
    for (const taskInput of moneyTasks) {
      try {
        console.log(`Creating task: ${taskInput.title}...`)
        
        const task = await db.tasks.create({
          lifeSystemId: moneySystem.id,
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
        console.log(`    Frequency: ${task.frequency}, Points: ${task.defaultPoints}`)
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
    
    console.log('\n📊 Summary:')
    console.log(`  ✅ Successfully created: ${createdTasks.length} money tasks`)
    console.log(`  ❌ Failed: ${errors.length} tasks`)
    
    if (errors.length > 0) {
      console.log('\n❌ Errors:')
      errors.forEach(({ task, error }) => {
        console.log(`  - ${task}: ${error}`)
      })
    }
    
    console.log('\n💡 Note: Task instances will be generated on-demand (virtual instances)')
    console.log('   when you view dates in the planner. No bulk generation needed!')
    
    return { createdTasks, errors }
  } catch (error: any) {
    console.error('Error loading money tasks:', error.message)
    throw error
  }
}

async function main() {
  const filePath = process.argv[2] || 'tasks-sample.json'
  
  try {
    console.log('🚀 Starting money tasks import...\n')
    console.log('='.repeat(60))
    console.log('')
    
    await clearAllTasks()
    await loadMoneyTasks(filePath)
    
    console.log('')
    console.log('='.repeat(60))
    console.log('✅ Money tasks import completed!')
  } catch (error: any) {
    console.error('\n❌ Import failed:', error.message)
    process.exit(1)
  }
}

main()


# Database Design Proposal: Recurring Tasks

## Current Problem

Our current design stores **every instance** of a recurring task in the database:
- Daily task for 1 year = **365 database entries**
- Multiple daily tasks = **thousands of entries**
- Most entries are just "pending" with no interaction

## Industry Best Practice

Research shows the standard approach is:
1. **Store recurrence patterns** (not instances)
2. **Generate instances virtually** (calculate on-the-fly)
3. **Only store exceptions** (completed/skipped instances)

## Proposed Design

### 1. Keep `system_tasks` (Recurrence Pattern)
```sql
system_tasks (
  id, life_system_id, title, description,
  frequency, start_date, end_date, ...
)
```
✅ **Already correct** - This stores the pattern, not instances

### 2. Rename `task_instances` → `task_completions` (Materialized Only)
Only store instances that have been **interacted with**:

```sql
task_completions (
  id UUID PRIMARY KEY,
  system_task_id UUID REFERENCES system_tasks(id),
  date DATE NOT NULL,
  status TEXT CHECK (status IN ('completed', 'skipped')),
  points_awarded INTEGER,
  completed_at TIMESTAMPTZ,
  UNIQUE(system_task_id, date)
)
```

**Key Change**: Remove `status = 'pending'` - pending instances don't exist in DB!

### 3. Add `task_exceptions` (Optional)
For dates that should be excluded from the pattern:

```sql
task_exceptions (
  id UUID PRIMARY KEY,
  system_task_id UUID REFERENCES system_tasks(id),
  date DATE NOT NULL,
  action TEXT CHECK (action IN ('skip', 'reschedule')),
  rescheduled_to DATE,
  UNIQUE(system_task_id, date)
)
```

## How It Works

### Virtual Instance Generation
```typescript
// Calculate instances on-the-fly
function getInstancesForDate(task: SystemTask, date: string): TaskInstance[] {
  // 1. Check if task should have instance on this date
  if (!shouldTaskHaveInstance(task, date)) return []
  
  // 2. Check exceptions table
  const exception = await getException(task.id, date)
  if (exception?.action === 'skip') return []
  
  // 3. Check if completed/skipped (materialized)
  const completion = await getCompletion(task.id, date)
  if (completion) {
    return [completion] // Return materialized instance
  }
  
  // 4. Return virtual pending instance
  return [{
    id: `virtual-${task.id}-${date}`, // Virtual ID
    systemTaskId: task.id,
    date,
    status: 'pending',
    pointsAwarded: 0,
    systemTask: task
  }]
}
```

### When to Materialize
- ✅ **Completed** → Store in `task_completions`
- ✅ **Skipped** → Store in `task_completions`
- ❌ **Pending** → Never store, always calculate

## Benefits

1. **Massive Storage Reduction**
   - 365 daily tasks = **0 pending entries** (only completed/skipped stored)
   - Only ~10-20% of tasks get completed → **80-90% storage savings**

2. **Faster Queries**
   - No need to generate/insert 365 instances
   - Calculate on-the-fly is faster than bulk inserts

3. **Flexible Pattern Changes**
   - Change task frequency → No need to delete 365 instances
   - Just update the pattern in `system_tasks`

4. **Industry Standard**
   - Same approach used by Google Calendar, Notion, Todoist
   - Proven to scale to millions of recurring tasks

## Migration Path

1. **Phase 1**: Keep current design, add virtual generation
2. **Phase 2**: Stop creating pending instances
3. **Phase 3**: Migrate existing pending instances (delete or mark as virtual)
4. **Phase 4**: Rename table to `task_completions`

## Example Comparison

### Current (Bad)
```
Daily task "Meditate" for 1 year:
- 365 rows in task_instances
- 340 rows with status='pending' (never interacted with)
- 25 rows with status='completed'
```

### Proposed (Good)
```
Daily task "Meditate" for 1 year:
- 0 rows for pending instances (calculated on-the-fly)
- 25 rows in task_completions (only completed ones)
- Storage: 93% reduction
```

## Implementation

The lazy generation we just implemented is a **step in the right direction**, but we should:
1. Stop storing pending instances entirely
2. Only materialize when completed/skipped
3. Calculate pending instances virtually from the pattern


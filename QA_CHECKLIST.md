# Life OS QA Checklist

## ✅ Pre-Deployment Testing

### 1. Task Creation & Virtual Instances
- [ ] Create a daily task → Should create instantly (no delay)
- [ ] Create a weekly task → Should create instantly
- [ ] Create a monthly task → Should create instantly
- [ ] Verify no database entries created for pending instances
- [ ] Check `task_instances` table → Should only have completed/skipped tasks

### 2. Task Display
- [ ] View today's tasks → All tasks (daily, weekly if today, monthly if today) should appear
- [ ] View weekly tasks section → Only weekly tasks should appear
- [ ] View monthly tasks section → Only monthly tasks should appear
- [ ] Change date selector → Tasks should update correctly
- [ ] View past dates → Should show historical tasks
- [ ] View future dates → Should show future virtual instances

### 3. Task Completion
- [ ] Complete a virtual instance → Should materialize (create DB entry)
- [ ] Verify points are awarded
- [ ] Verify streak is updated
- [ ] Verify daily score is updated
- [ ] Complete a materialized instance → Should update existing entry
- [ ] Check database → Completed task should be in `task_instances` table

### 4. Task Skipping
- [ ] Skip a virtual instance → Should materialize (create DB entry)
- [ ] Skip a materialized instance → Should update existing entry
- [ ] Check database → Skipped task should be in `task_instances` table

### 5. Frequency Logic
- [ ] Daily task → Appears every day within date range
- [ ] Weekly task → Appears only on same day of week as start date
- [ ] Monthly task → Appears only on same day of month as start date
- [ ] Task with end date → Stops appearing after end date
- [ ] Task with start date in future → Doesn't appear before start date

### 6. Week/Month Filtering
- [ ] Weekly tasks section → Shows only tasks with `frequency === 'weekly'`
- [ ] Monthly tasks section → Shows only tasks with `frequency === 'monthly'`
- [ ] Daily tasks → Should NOT appear in weekly/monthly sections
- [ ] Weekly tasks → Should NOT appear in monthly section

### 7. Gamification
- [ ] Complete task → Points added to total
- [ ] Complete multiple tasks → Points accumulate
- [ ] Check level progression → Level should increase at 100 point intervals
- [ ] Check streak → Streak should increment on consecutive days
- [ ] Check daily score → Should show points earned today
- [ ] View progress dashboard → All stats should be accurate

### 8. Edge Cases
- [ ] Task with past start date → Should generate instances from start date
- [ ] Task with future start date → Should not generate instances before start
- [ ] Task with end date → Should stop generating after end date
- [ ] Multiple tasks same day → All should appear correctly
- [ ] No tasks for date → Should show empty state
- [ ] All tasks completed → Should show completion message

### 9. Performance
- [ ] Create task → Should be < 1 second
- [ ] Load planner page → Should be < 2 seconds
- [ ] Change date → Should update quickly (< 500ms)
- [ ] Complete task → Should be < 1 second
- [ ] No API timeouts → All requests should complete

### 10. Database Efficiency
- [ ] Check `task_instances` table → Should have NO pending instances
- [ ] Only completed/skipped instances in database
- [ ] Virtual instances not stored → Verify by checking DB directly
- [ ] Database size → Should be minimal (only materialized instances)

### 11. Error Handling
- [ ] Invalid task data → Should show error message
- [ ] Network error → Should handle gracefully
- [ ] Missing task → Should show appropriate message
- [ ] Console errors → Check browser console for errors
- [ ] Server errors → Check terminal for errors

### 12. UI/UX
- [ ] All buttons work → Complete, Skip, Quick Add
- [ ] Loading states → Show spinners during operations
- [ ] Success feedback → Tasks update after completion
- [ ] Date selector → Works correctly
- [ ] Responsive design → Works on mobile/tablet
- [ ] Visual feedback → Tasks highlight on hover/click

## 🐛 Known Issues to Check

1. **Virtual Instance Materialization**
   - When completing virtual instance, verify it creates DB entry
   - When skipping virtual instance, verify it creates DB entry

2. **Week/Month Filtering**
   - Weekly section should only show weekly tasks
   - Monthly section should only show monthly tasks
   - Daily tasks should NOT appear in these sections

3. **Date Range Logic**
   - Weekly tasks appear on correct day of week
   - Monthly tasks appear on correct day of month
   - Tasks respect start/end dates

## 📝 Test Results

Date: _______________
Tester: _______________

### Critical Issues Found:
- [ ] None
- [ ] Issue 1: ________________
- [ ] Issue 2: ________________

### Minor Issues Found:
- [ ] None
- [ ] Issue 1: ________________
- [ ] Issue 2: ________________

### Overall Status:
- [ ] ✅ Ready to Deploy
- [ ] ⚠️ Needs Fixes (see issues above)
- [ ] ❌ Not Ready

---

## Quick Test Commands

```bash
# Check database for pending instances (should be 0)
# Run in Supabase SQL editor:
SELECT COUNT(*) FROM task_instances WHERE status = 'pending';

# Check virtual instances are working (should return tasks)
# In browser console on /admin/planner:
fetch('/api/life-os/instances?date=2026-01-05').then(r => r.json()).then(console.log)

# Test task creation speed
# Create task via UI and check network tab - should be < 1s
```


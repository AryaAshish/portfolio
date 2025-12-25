'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Course, CourseModule } from '@/types'

export default function EditCoursesPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/admin/content/courses')
      const data = await response.json()
      if (data.courses) {
        setCourses(data.courses)
      }
    } catch (error) {
      console.error('Failed to fetch content:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/admin/content/courses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courses }),
      })

      const data = await response.json()
      if (data.success) {
        alert('Courses updated successfully!')
        router.push('/admin')
      } else {
        alert(data.message || 'Failed to save')
      }
    } catch (error) {
      alert('Error saving content')
    } finally {
      setSaving(false)
    }
  }

  const addCourse = () => {
    setCourses([
      ...courses,
      {
        id: `course-${Date.now()}`,
        title: '',
        description: '',
        modules: [],
        status: 'coming-soon',
      },
    ])
  }

  const removeCourse = (index: number) => {
    setCourses(courses.filter((_, i) => i !== index))
  }

  const updateCourse = (index: number, field: keyof Course, value: any) => {
    const updated = [...courses]
    updated[index] = { ...updated[index], [field]: value }
    setCourses(updated)
  }

  const addModule = (courseIndex: number) => {
    const updated = [...courses]
    updated[courseIndex].modules.push({
      title: '',
      description: '',
      lessons: [''],
    })
    setCourses(updated)
  }

  const removeModule = (courseIndex: number, moduleIndex: number) => {
    const updated = [...courses]
    updated[courseIndex].modules = updated[courseIndex].modules.filter((_, i) => i !== moduleIndex)
    setCourses(updated)
  }

  const updateModule = (
    courseIndex: number,
    moduleIndex: number,
    field: keyof CourseModule,
    value: any
  ) => {
    const updated = [...courses]
    updated[courseIndex].modules[moduleIndex] = {
      ...updated[courseIndex].modules[moduleIndex],
      [field]: value,
    }
    setCourses(updated)
  }

  const addLesson = (courseIndex: number, moduleIndex: number) => {
    const updated = [...courses]
    updated[courseIndex].modules[moduleIndex].lessons.push('')
    setCourses(updated)
  }

  const removeLesson = (courseIndex: number, moduleIndex: number, lessonIndex: number) => {
    const updated = [...courses]
    updated[courseIndex].modules[moduleIndex].lessons = updated[courseIndex].modules[
      moduleIndex
    ].lessons.filter((_, i) => i !== lessonIndex)
    setCourses(updated)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-off flex items-center justify-center">
        <p className="text-ocean-base">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-off py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="font-serif text-4xl text-ocean-deep mb-2">Edit Courses</h1>
            <p className="text-ocean-base">Manage your course offerings</p>
          </div>
          <button
            onClick={addCourse}
            className="px-6 py-3 bg-teal-base text-neutral-white rounded-lg font-medium hover:bg-teal-dark transition-colors"
          >
            Add Course
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {courses.map((course, courseIndex) => (
            <div key={course.id} className="bg-neutral-white rounded-xl p-6 shadow-lg space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-serif text-2xl text-ocean-deep">{course.title || `Course #${courseIndex + 1}`}</h3>
                <button
                  type="button"
                  onClick={() => removeCourse(courseIndex)}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                >
                  Remove
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ocean-deep mb-2">Title *</label>
                  <input
                    type="text"
                    value={course.title}
                    onChange={(e) => updateCourse(courseIndex, 'title', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ocean-deep mb-2">Status *</label>
                  <select
                    value={course.status}
                    onChange={(e) => updateCourse(courseIndex, 'status', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                    required
                  >
                    <option value="coming-soon">Coming Soon</option>
                    <option value="live">Live</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ocean-deep mb-2">Description *</label>
                <textarea
                  value={course.description}
                  onChange={(e) => updateCourse(courseIndex, 'description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ocean-deep mb-2">Price</label>
                  <input
                    type="number"
                    value={course.price || ''}
                    onChange={(e) => updateCourse(courseIndex, 'price', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ocean-deep mb-2">Currency</label>
                  <input
                    type="text"
                    value={course.currency || '$'}
                    onChange={(e) => updateCourse(courseIndex, 'currency', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-ocean-deep">Modules</label>
                  <button
                    type="button"
                    onClick={() => addModule(courseIndex)}
                    className="text-sm text-teal-base hover:text-teal-dark"
                  >
                    + Add Module
                  </button>
                </div>
                {course.modules.map((module, moduleIndex) => (
                  <div key={moduleIndex} className="mb-4 p-4 bg-ocean-pale/10 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-ocean-deep">Module {moduleIndex + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeModule(courseIndex, moduleIndex)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={module.title}
                        onChange={(e) => updateModule(courseIndex, moduleIndex, 'title', e.target.value)}
                        placeholder="Module title"
                        className="w-full px-3 py-2 rounded border border-ocean-light bg-neutral-white text-ocean-deep text-sm"
                      />
                      <textarea
                        value={module.description}
                        onChange={(e) => updateModule(courseIndex, moduleIndex, 'description', e.target.value)}
                        placeholder="Module description"
                        rows={2}
                        className="w-full px-3 py-2 rounded border border-ocean-light bg-neutral-white text-ocean-deep text-sm"
                      />
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-ocean-base">Lessons</span>
                          <button
                            type="button"
                            onClick={() => addLesson(courseIndex, moduleIndex)}
                            className="text-xs text-teal-base"
                          >
                            + Add
                          </button>
                        </div>
                        {module.lessons.map((lesson, lessonIndex) => (
                          <div key={lessonIndex} className="flex gap-2 mb-1">
                            <input
                              type="text"
                              value={lesson}
                              onChange={(e) => {
                                const updated = [...courses]
                                updated[courseIndex].modules[moduleIndex].lessons[lessonIndex] = e.target.value
                                setCourses(updated)
                              }}
                              placeholder="Lesson name"
                              className="flex-1 px-3 py-1 rounded border border-ocean-light bg-neutral-white text-ocean-deep text-sm"
                            />
                            <button
                              type="button"
                              onClick={() => removeLesson(courseIndex, moduleIndex, lessonIndex)}
                              className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-teal-base text-neutral-white rounded-lg font-medium hover:bg-teal-dark transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <a
              href="/admin"
              className="px-8 py-3 bg-ocean-light text-ocean-deep rounded-lg font-medium hover:bg-ocean-base transition-colors"
            >
              Cancel
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}



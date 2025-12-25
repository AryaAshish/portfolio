'use client'

import Link from 'next/link'
import { Course } from '@/types'
import { motion } from 'framer-motion'

interface CourseCardProps {
  course: Course
  index: number
}

export function CourseCard({ course, index }: CourseCardProps) {
  const isComingSoon = course.status === 'coming-soon'
  const isDraft = !course.status

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-neutral-white rounded-xl p-6 shadow-lg border border-ocean-light/20 hover:shadow-xl transition-all ${
        isComingSoon || isDraft ? 'opacity-75' : ''
      }`}
    >
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span
            className={`text-xs font-semibold uppercase tracking-wide ${
              isComingSoon
                ? 'text-ocean-light'
                : course.status === 'active'
                ? 'text-teal-base'
                : 'text-gray-400'
            }`}
          >
            {isComingSoon ? 'Coming Soon' : course.status === 'active' ? 'Live' : 'Draft'}
          </span>
          {course.price && course.status === 'active' && (
            <span className="text-lg font-bold text-ocean-deep">
              {course.currency || '$'}
              {course.price}
            </span>
          )}
        </div>
        <h3 className="font-serif text-2xl text-ocean-deep mb-2">{course.title}</h3>
        <p className="text-ocean-base">{course.description}</p>
      </div>

      {course.modules && course.modules.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-semibold text-ocean-deep mb-2">
            {(course.modules || []).length} Module{(course.modules || []).length !== 1 ? 's' : ''}
          </p>
          <ul className="list-disc list-inside text-sm text-ocean-base space-y-1">
            {(course.modules || []).slice(0, 3).map((module, idx) => (
              <li key={idx}>{module.title}</li>
            ))}
            {(course.modules || []).length > 3 && (
              <li className="text-ocean-light">+{(course.modules || []).length - 3} more</li>
            )}
          </ul>
        </div>
      )}

      <div className="flex gap-3">
        {isComingSoon ? (
          <button
            disabled
            className="px-6 py-2 bg-ocean-light/30 text-ocean-base rounded-lg font-medium cursor-not-allowed"
          >
            Coming Soon
          </button>
        ) : isDraft ? (
          <button
            disabled
            className="px-6 py-2 bg-gray-200 text-gray-500 rounded-lg font-medium cursor-not-allowed"
          >
            Draft
          </button>
        ) : (
          <Link
            href={`/learn/${course.id}`}
            className="px-6 py-2 bg-teal-base text-neutral-white rounded-lg font-medium hover:bg-teal-dark transition-colors"
          >
            View Course
          </Link>
        )}
      </div>
    </motion.div>
  )
}


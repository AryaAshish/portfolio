'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'

const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().optional(),
})

type NewsletterFormData = z.infer<typeof newsletterSchema>

interface NewsletterSignupProps {
  source?: string
  compact?: boolean
}

export function NewsletterSignup({ source, compact = false }: NewsletterSignupProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
  })

  const onSubmit = async (data: NewsletterFormData) => {
    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          name: data.name,
          source: source || 'unknown',
        }),
      })

      const result = await response.json()

      if (result.success) {
        setStatus('success')
        setMessage('Thank you for subscribing!')
        reset()
      } else {
        setStatus('error')
        setMessage(result.message || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-2">
        <input
          {...register('email')}
          type="email"
          placeholder="Enter your email"
          className="flex-1 px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-6 py-2 bg-teal-base text-neutral-white rounded-lg font-medium hover:bg-teal-dark transition-colors disabled:opacity-50"
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </button>
        {errors.email && (
          <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
        )}
        {message && (
          <p className={`text-sm mt-1 ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </form>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-ocean-dark to-ocean-base rounded-2xl p-8 text-neutral-white"
    >
      <h3 className="font-serif text-2xl mb-2">Join the Newsletter</h3>
      <p className="text-ocean-pale mb-6">
        Short, practical notes on engineering, careers, and building calm systems — no spam.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            {...register('name')}
            type="text"
            placeholder="Your name (optional)"
            className="w-full px-4 py-3 rounded-lg border border-ocean-light/30 bg-ocean-dark/50 text-neutral-white placeholder-ocean-pale focus:outline-none focus:ring-2 focus:ring-teal-light"
          />
        </div>
        <div>
          <input
            {...register('email')}
            type="email"
            placeholder="your@email.com"
            className="w-full px-4 py-3 rounded-lg border border-ocean-light/30 bg-ocean-dark/50 text-neutral-white placeholder-ocean-pale focus:outline-none focus:ring-2 focus:ring-teal-light"
          />
          {errors.email && (
            <p className="text-sm text-red-400 mt-1">{errors.email.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full px-6 py-3 bg-teal-base text-neutral-white rounded-lg font-medium hover:bg-teal-dark transition-colors disabled:opacity-50"
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </button>
        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-sm text-center ${
              status === 'success' ? 'text-teal-light' : 'text-red-400'
            }`}
          >
            {message}
          </motion.p>
        )}
      </form>
    </motion.div>
  )
}




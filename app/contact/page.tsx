'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { ContactFormData } from '@/types'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  purpose: z.enum(['hiring', 'collaboration', 'general']),
})

type ContactFormInputs = z.infer<typeof contactSchema>

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormInputs>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      purpose: 'general',
    },
  })

  const onSubmit = async (data: ContactFormInputs) => {
    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        setStatus('success')
        setMessage("Thank you for reaching out! I'll get back to you soon.")
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

  return (
    <div className="min-h-screen bg-neutral-off">
      <section className="py-20 bg-gradient-to-b from-ocean-deep to-ocean-dark text-neutral-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-serif text-5xl md:text-6xl mb-6">Get In Touch</h1>
            <p className="text-xl text-ocean-pale">
              Have a question, opportunity, or just want to connect? I&apos;d love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-ocean-dark to-neutral-off">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-neutral-white rounded-xl p-8 shadow-lg border border-ocean-light/10"
            >
              <h2 className="font-serif text-3xl text-ocean-deep mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-ocean-deep mb-2">Email</h3>
                  <a
                    href="mailto:thearyanashish09@gmail.com"
                    className="text-teal-base hover:text-teal-dark"
                  >
                    thearyanashish09@gmail.com
                  </a>
                </div>
                <div>
                  <h3 className="font-semibold text-ocean-deep mb-2">Phone</h3>
                  <a
                    href="tel:+919549305633"
                    className="text-teal-base hover:text-teal-dark"
                  >
                    +91-9549305633
                  </a>
                </div>
                <div>
                  <h3 className="font-semibold text-ocean-deep mb-2">Location</h3>
                  <p className="text-ocean-base">Bengaluru, India</p>
                </div>
                <div>
                  <h3 className="font-semibold text-ocean-deep mb-2">Social</h3>
                  <div className="flex flex-col space-y-2">
                    <a
                      href="https://linkedin.com/in/aryanashish"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-base hover:text-teal-dark"
                    >
                      LinkedIn
                    </a>
                    <a
                      href="https://leetcode.com/u/aryanAshish/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-base hover:text-teal-dark"
                    >
                      LeetCode
                    </a>
                  </div>
                </div>
                <div className="pt-6">
                  <h3 className="font-semibold text-ocean-deep mb-2">Hiring?</h3>
                  <p className="text-ocean-base">
                    If you&apos;re looking to hire, check out my{' '}
                    <a href="/experience" className="text-teal-base hover:text-teal-dark">
                      experience page
                    </a>{' '}
                    and let&apos;s talk about how I can help your team.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-neutral-white rounded-xl p-8 shadow-lg"
            >
              <h2 className="font-serif text-3xl text-ocean-deep mb-6">Send a Message</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-ocean-deep mb-2">
                    Name
                  </label>
                  <input
                    {...register('name')}
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-ocean-deep mb-2"
                  >
                    Email
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="purpose"
                    className="block text-sm font-medium text-ocean-deep mb-2"
                  >
                    Purpose
                  </label>
                  <select
                    {...register('purpose')}
                    id="purpose"
                    className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="hiring">Hiring Opportunity</option>
                    <option value="collaboration">Collaboration</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-ocean-deep mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    {...register('message')}
                    id="message"
                    rows={6}
                    className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                  />
                  {errors.message && (
                    <p className="text-sm text-red-600 mt-1">{errors.message.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full px-6 py-3 bg-teal-base text-neutral-white rounded-lg font-medium hover:bg-teal-dark transition-colors disabled:opacity-50"
                >
                  {status === 'loading' ? 'Sending...' : 'Send Message'}
                </button>

                {message && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`text-sm text-center ${
                      status === 'success' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {message}
                  </motion.p>
                )}
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}


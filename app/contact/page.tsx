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
            <h1 className="font-serif text-5xl md:text-6xl mb-6">Let&apos;s Talk</h1>
            <p className="text-xl text-ocean-pale leading-relaxed">
              Whether you&apos;re hiring, building something interesting, or just want to chat about code, scuba diving, or motorcycles—I&apos;m all ears.
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
              <h2 className="font-serif text-3xl text-ocean-deep mb-6">Ways to Reach Me</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-ocean-deep mb-2">📧 Email</h3>
                  <a
                    href="mailto:thearyanashish09@gmail.com"
                    className="text-teal-base hover:text-teal-dark transition-colors"
                  >
                    thearyanashish09@gmail.com
                  </a>
                  <p className="text-sm text-ocean-base mt-1">Best for detailed conversations</p>
                </div>
                <div>
                  <h3 className="font-semibold text-ocean-deep mb-2">📍 Based in</h3>
                  <p className="text-ocean-base">Bengaluru, India</p>
                  <p className="text-sm text-ocean-base mt-1">Open to remote opportunities worldwide</p>
                </div>
                <div>
                  <h3 className="font-semibold text-ocean-deep mb-2">🌐 Find Me Online</h3>
                  <div className="flex flex-col space-y-2">
                    <a
                      href="https://linkedin.com/in/aryanashish"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-base hover:text-teal-dark transition-colors flex items-center gap-2"
                    >
                      <span>LinkedIn</span>
                      <span className="text-xs text-ocean-base">— Professional updates</span>
                    </a>
                    <a
                      href="https://github.com/AryaAshish"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-base hover:text-teal-dark transition-colors flex items-center gap-2"
                    >
                      <span>GitHub</span>
                      <span className="text-xs text-ocean-base">— Code & projects</span>
                    </a>
                    <a
                      href="https://www.instagram.com/musafir.codes/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-base hover:text-teal-dark transition-colors flex items-center gap-2"
                    >
                      <span>Instagram</span>
                      <span className="text-xs text-ocean-base">— Life & adventures</span>
                    </a>
                    <a
                      href="https://leetcode.com/u/aryanAshish/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-base hover:text-teal-dark transition-colors flex items-center gap-2"
                    >
                      <span>LeetCode</span>
                      <span className="text-xs text-ocean-base">— Problem solving</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-neutral-white rounded-xl p-8 shadow-lg"
            >
              <h2 className="font-serif text-3xl text-ocean-deep mb-6">Drop Me a Line</h2>
              <p className="text-ocean-base mb-6">
                I typically respond within 24 hours. The more specific you are, the better I can help.
              </p>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-ocean-deep mb-2">
                    Your Name *
                  </label>
                  <input
                    {...register('name')}
                    type="text"
                    id="name"
                    placeholder="John Doe"
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
                    Your Email *
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    id="email"
                    placeholder="john@example.com"
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
                    What&apos;s this about? *
                  </label>
                  <select
                    {...register('purpose')}
                    id="purpose"
                    className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                  >
                    <option value="general">Just saying hi / General question</option>
                    <option value="hiring">Job opportunity / Hiring</option>
                    <option value="collaboration">Project collaboration / Partnership</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-ocean-deep mb-2"
                  >
                    Your Message *
                  </label>
                  <textarea
                    {...register('message')}
                    id="message"
                    rows={6}
                    placeholder="Tell me what's on your mind..."
                    className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base resize-none"
                  />
                  {errors.message && (
                    <p className="text-sm text-red-600 mt-1">{errors.message.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full px-6 py-3 bg-teal-base text-neutral-white rounded-lg font-medium hover:bg-teal-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? 'Sending...' : 'Send Message'}
                </button>

                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg text-center ${
                      status === 'success' 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {message}
                  </motion.div>
                )}
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-b from-neutral-off to-ocean-pale/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-ocean-deep to-ocean-dark rounded-2xl p-8 md:p-12 shadow-2xl text-center"
          >
            <h2 className="font-serif text-3xl md:text-4xl text-neutral-white mb-4">
              Join the Newsletter
            </h2>
            <p className="text-ocean-pale text-lg mb-8 max-w-2xl mx-auto">
              Get updates on new blog posts, life adventures, and tech insights. No spam, just good content. Unsubscribe anytime.
            </p>
            <form
              action="/api/newsletter/subscribe"
              method="POST"
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                required
                className="flex-1 px-6 py-3 rounded-lg border-2 border-ocean-light/30 bg-neutral-white/10 backdrop-blur-sm text-neutral-white placeholder-ocean-pale/60 focus:outline-none focus:ring-2 focus:ring-teal-base focus:border-transparent"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-teal-base text-neutral-white rounded-lg font-medium hover:bg-teal-dark transition-colors shadow-lg hover:shadow-xl"
              >
                Subscribe
              </button>
            </form>
            <p className="text-ocean-pale/70 text-sm mt-4">
              Join 100+ developers and adventurers
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}


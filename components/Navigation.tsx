'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Logo } from './Logo'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/experience', label: 'Experience' },
  { href: '/blog', label: 'Writing' },
  { href: '/life', label: 'Life' },
  { href: '/contact', label: 'Contact' },
]

export function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isHomePage = pathname === '/'
  
  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isHomePage 
        ? 'bg-gradient-to-b from-ocean-deep/40 via-ocean-dark/30 to-transparent backdrop-blur-sm border-b border-teal-light/20' 
        : 'bg-neutral-white/95 backdrop-blur-sm border-b border-ocean-light/20 shadow-md'
    }`}>
      {/* Subtle underwater effect on home page */}
      {isHomePage && (
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-deep/60 to-transparent pointer-events-none" />
      )}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <div className="flex items-center gap-3">
            <Logo 
              size={isHomePage ? 44 : 40} 
              className={isHomePage ? 'drop-shadow-lg' : ''}
            />
            <Link 
              href="/" 
              className={`font-serif text-xl md:text-2xl heading-serif transition-colors ${
                isHomePage 
                  ? 'text-neutral-white drop-shadow-lg hover:text-teal-light' 
                  : 'text-ocean-deep hover:text-teal-base'
              }`}
            >
              Musafir
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-8 lg:space-x-12">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative text-sm font-medium transition-colors py-2 ${
                    isActive 
                      ? isHomePage
                        ? 'text-teal-light drop-shadow-md'
                        : 'text-teal-base drop-shadow-md'
                      : isHomePage
                        ? 'text-neutral-white/90 drop-shadow-sm hover:text-teal-light'
                        : 'text-ocean-deep/80 hover:text-teal-base'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className={`absolute -bottom-1 left-0 right-0 h-0.5 rounded-full ${
                        isHomePage ? 'bg-teal-light shadow-lg shadow-teal-light/50' : 'bg-teal-light'
                      }`}
                      initial={false}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          <button
            className={`md:hidden transition-colors ${
              isHomePage 
                ? 'text-neutral-white drop-shadow-lg hover:text-teal-light' 
                : 'text-ocean-deep hover:text-teal-base'
            }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className={`md:hidden overflow-hidden ${
                isHomePage 
                  ? 'border-t border-teal-light/20 bg-ocean-dark/40 backdrop-blur-sm' 
                  : 'border-t border-ocean-dark/30'
              }`}
            >
              <div className="py-4 space-y-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? `text-teal-light ${isHomePage ? 'bg-ocean-dark/60 drop-shadow-md' : 'bg-ocean-dark/50'}`
                          : isHomePage
                            ? 'text-neutral-white/90 hover:text-teal-light hover:bg-ocean-dark/40 drop-shadow-sm'
                            : 'text-neutral-white/80 hover:text-teal-light hover:bg-ocean-dark/30'
                      }`}
                    >
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}



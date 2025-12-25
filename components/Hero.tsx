'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Lionfish, Parrotfish, Pufferfish, Squid, Coral, Bannerfish, Clownfish, Sponge, Anemone } from './MarineLife'

interface CoralImage {
  url: string
  cropX?: number
  cropY?: number
  cropWidth?: number
  cropHeight?: number
}

interface HeroProps {
  title: string
  subtitle: string
  backgroundImageUrl?: string
  coralImages?: CoralImage[]
  cta: {
    primary: { text: string; href: string }
    secondary: { text: string; href: string }
    tertiary: { text: string; href: string }
  }
}

interface Bubble {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
}

export function Hero({ title, subtitle, backgroundImageUrl, coralImages, cta }: HeroProps) {
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const generateBubbles = () => {
      const newBubbles: Bubble[] = []
      for (let i = 0; i < 40; i++) {
        newBubbles.push({
          id: i,
          x: Math.random() * 100,
          y: 100 + Math.random() * 20,
          size: Math.random() * 15 + 8,
          duration: Math.random() * 8 + 6,
          delay: Math.random() * 3,
        })
      }
      setBubbles(newBubbles)
    }
    generateBubbles()
  }, [])

  const heroImages = coralImages && coralImages.length > 0 ? coralImages : []

  useEffect(() => {
    if (heroImages.length === 0) return
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [heroImages.length])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-ocean-deep via-ocean-dark to-ocean-base">
      {/* Coral Images as Background - Auto-sliding Carousel */}
      {heroImages.length > 0 && (
        <div className="absolute inset-0 w-full h-full">
          {heroImages.map((image, index) => {
          const objectPosition = image.cropX && image.cropY 
            ? `${image.cropX}% ${image.cropY}%` 
            : 'center center'
          
          return (
            <motion.div
              key={image.url}
              className="absolute inset-0 w-full h-full"
              initial={{ opacity: 0, x: 100 }}
              animate={{ 
                opacity: currentImageIndex === index ? 1 : 0,
                x: currentImageIndex === index ? 0 : -100
              }}
              transition={{ duration: 1, ease: 'easeInOut' }}
            >
              <Image
                src={image.url}
                alt={`Coral background ${index + 1}`}
                fill
                priority={index === 0}
                className="object-cover"
                style={{
                  objectPosition: objectPosition,
                }}
                quality={90}
                unoptimized={image.url.includes('supabase.co')}
              />
            </motion.div>
          )
          })}
          <div className="absolute inset-0 bg-gradient-to-b from-ocean-deep/40 via-transparent to-ocean-base/30 z-10" />
        </div>
      )}

      {/* Original Background Image - Kept for reference but not used when coral images are present */}
      {/* 
      {backgroundImageUrl && (
        <div className="absolute inset-0 w-full h-full z-0">
          <Image
            src={backgroundImageUrl}
            alt="Hero background"
            fill
            priority
            className="object-cover object-center"
            style={{
              objectPosition: 'center center',
            }}
            quality={90}
            unoptimized={backgroundImageUrl.includes('supabase.co')}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ocean-deep/60 via-ocean-dark/40 to-ocean-base/50 z-[1]" />
        </div>
      )}
      */}

      {/* Underwater scene - decorative marine life - COMMENTED OUT TO USE CORAL IMAGES INSTEAD */}
      {/* 
      <div className="absolute inset-0 overflow-hidden z-[2]">
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`ray-${i}`}
              className="absolute top-0 w-1 bg-gradient-to-b from-teal-light/20 via-transparent to-transparent"
              style={{
                left: `${20 + i * 20}%`,
                height: '100%',
                transform: `rotate(${-5 + i * 2}deg)`,
              }}
              animate={{
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        <Coral x={3} y={5} type="branch" delay={0.2} />
        <Coral x={12} y={8} type="brain" delay={0.4} />
        <Coral x={22} y={6} type="fan" delay={0.3} />
        <Coral x={32} y={7} type="branch" delay={0.5} />
        <Coral x={42} y={5} type="brain" delay={0.6} />
        <Coral x={52} y={6} type="fan" delay={0.4} />
        <Coral x={62} y={8} type="branch" delay={0.3} />
        <Coral x={72} y={5} type="brain" delay={0.5} />
        <Coral x={82} y={7} type="fan" delay={0.4} />
        <Coral x={92} y={6} type="branch" delay={0.6} />
        
        <Sponge x={8} y={3} delay={0.7} color="yellow" />
        <Sponge x={28} y={4} delay={0.8} color="orange" />
        <Sponge x={48} y={3} delay={0.9} color="purple" />
        <Sponge x={68} y={4} delay={1.0} color="yellow" />
        <Sponge x={88} y={3} delay={1.1} color="orange" />
        
        <Anemone x={18} y={4} delay={1.2} color="green" />
        <Anemone x={38} y={5} delay={1.3} color="purple" />
        <Anemone x={58} y={4} delay={1.4} color="pink" />
        <Anemone x={78} y={5} delay={1.5} color="green" />

        <Bannerfish x={-10} y={20} delay={0.8} direction="right" />
        <Bannerfish x={110} y={35} delay={2} direction="left" />
        <Bannerfish x={-10} y={50} delay={3.5} direction="right" />
        
        <Clownfish x={15} y={60} delay={1} direction="right" />
        <Clownfish x={35} y={55} delay={1.5} direction="left" />
        <Clownfish x={55} y={60} delay={2.2} direction="right" />
        <Clownfish x={75} y={55} delay={2.8} direction="left" />
        
        <Parrotfish x={-5} y={25} delay={1.2} />
        <Parrotfish x={105} y={30} delay={2.5} />
        <Parrotfish x={-5} y={45} delay={4} />
        
        <Lionfish x={20} y={28} delay={1.8} />
        <Lionfish x={60} y={38} delay={3} />
        <Lionfish x={85} y={48} delay={4.5} />
        
        <Pufferfish x={25} y={40} delay={2.2} />
        <Pufferfish x={50} y={45} delay={3.5} />
        <Pufferfish x={75} y={50} delay={5} />
        
        <Squid x={40} y={32} delay={2.5} />
        <Squid x={70} y={42} delay={4} />
        <Squid x={10} y={52} delay={5.5} />

        {bubbles.map((bubble) => {
          const driftX = [
            0,
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 70,
          ]
          return (
            <motion.div
              key={bubble.id}
              className="absolute rounded-full"
              style={{
                left: `${bubble.x}%`,
                top: `${bubble.y}%`,
                width: bubble.size,
                height: bubble.size,
              }}
              animate={{
                y: [0, -800, -1200],
                opacity: [0, 0.6, 0.8, 0.6, 0],
                scale: [0.8, 1, 1.1, 0.9, 0.5],
                x: driftX,
              }}
              transition={{
                duration: bubble.duration,
                repeat: Infinity,
                delay: bubble.delay,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <div
                className="w-full h-full rounded-full border-2 border-teal-light/40"
                style={{
                  background: `radial-gradient(circle at 30% 30%, rgba(38, 208, 206, 0.4), rgba(38, 208, 206, 0.1), transparent)`,
                  boxShadow: `inset -2px -2px 4px rgba(38, 208, 206, 0.3), 0 0 8px rgba(38, 208, 206, 0.2)`,
                }}
              />
            </motion.div>
          )
        })}

        {[...Array(20)].map((_, i) => {
          const startX = Math.random() * 100
          const startY = Math.random() * 30
          const size = Math.random() * 6 + 4
          return (
            <motion.div
              key={`small-bubble-${i}`}
              className="absolute rounded-full border border-teal-light/20 bg-teal-light/5"
              style={{
                left: `${startX}%`,
                bottom: `${startY}%`,
                width: size,
                height: size,
              }}
              animate={{
                y: [0, -600, -900],
                opacity: [0.3, 0.5, 0],
                scale: [1, 1.2, 0.8],
              }}
              transition={{
                duration: Math.random() * 5 + 4,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: 'easeOut',
              }}
            />
          )
        })}
      </div>
      */}

      {/* Content */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.h1
            className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-neutral-white mb-8 whitespace-pre-line heading-serif leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {title}
          </motion.h1>
          <motion.p
            className="text-base md:text-lg lg:text-xl text-neutral-white mb-12 leading-relaxed px-8 py-4 rounded-full bg-neutral-white/20 backdrop-blur-lg border-2 border-neutral-white/30 shadow-2xl inline-block font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {subtitle}
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link
              href={cta.primary.href}
              className="px-8 py-4 bg-neutral-white text-ocean-deep rounded-lg font-medium relative z-10 shadow-xl hover:bg-ocean-pale hover:shadow-2xl transition-all transform hover:scale-105"
            >
              {cta.primary.text}
            </Link>
            <Link
              href={cta.secondary.href}
              className="px-8 py-4 bg-ocean-deep text-neutral-white rounded-lg font-medium hover:bg-ocean-dark hover:shadow-2xl transition-all shadow-xl transform hover:scale-105"
            >
              {cta.secondary.text}
            </Link>
            <Link
              href={cta.tertiary.href}
              className="px-8 py-4 bg-teal-base text-neutral-white rounded-lg font-medium hover:bg-teal-dark hover:shadow-2xl transition-all shadow-xl transform hover:scale-105"
            >
              {cta.tertiary.text}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

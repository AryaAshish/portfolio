'use client'

import { motion } from 'framer-motion'

// Lionfish Component - slow drift
export function Lionfish({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <motion.div
      className="absolute"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      <motion.svg
        width="80"
        height="60"
        viewBox="0 0 80 60"
        className="filter drop-shadow-lg"
        animate={{
          x: [0, 20, -15, 10, -5, 0],
          y: [0, -8, 5, -3, 2, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Lionfish body */}
        <ellipse cx="40" cy="30" rx="25" ry="15" fill="#ff6b6b" opacity="0.9" />
        {/* Stripes */}
        <line x1="30" y1="25" x2="30" y2="35" stroke="#8b0000" strokeWidth="2" />
        <line x1="40" y1="22" x2="40" y2="38" stroke="#8b0000" strokeWidth="2" />
        <line x1="50" y1="25" x2="50" y2="35" stroke="#8b0000" strokeWidth="2" />
        {/* Fins */}
        <path d="M 20 30 Q 10 20, 5 25 Q 10 30, 20 30" fill="#ff6b6b" opacity="0.8" />
        <path d="M 60 30 Q 70 20, 75 25 Q 70 30, 60 30" fill="#ff6b6b" opacity="0.8" />
        {/* Spines */}
        <line x1="15" y1="28" x2="10" y2="20" stroke="#ff6b6b" strokeWidth="1.5" />
        <line x1="15" y1="32" x2="10" y2="40" stroke="#ff6b6b" strokeWidth="1.5" />
      </motion.svg>
    </motion.div>
  )
}

// Parrotfish Component - swimming across screen
export function Parrotfish({ x, y, delay, direction = 'right' }: { x: number; y: number; delay: number; direction?: 'left' | 'right' }) {
  const swimPath = direction === 'right'
    ? { x: [0, 40, 80, 120, 160], y: [0, -8, 5, -3, 0] }
    : { x: [0, -40, -80, -120, -160], y: [0, -8, 5, -3, 0] }
  
  return (
    <motion.div
      className="absolute"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      <motion.svg
        width="100"
        height="50"
        viewBox="0 0 100 50"
        className="filter drop-shadow-lg"
        animate={swimPath}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          transform: direction === 'left' ? 'scaleX(-1)' : 'none',
        }}
      >
        {/* Parrotfish body */}
        <ellipse cx="50" cy="25" rx="35" ry="18" fill="#00d4ff" opacity="0.85" />
        {/* Beak */}
        <path d="M 70 25 L 85 20 L 85 30 Z" fill="#ffa500" />
        {/* Eye */}
        <circle cx="45" cy="22" r="4" fill="#000" />
        <circle cx="46" cy="21" r="1.5" fill="#fff" />
        {/* Fins */}
        <ellipse cx="30" cy="20" rx="8" ry="12" fill="#00a8cc" opacity="0.7" />
        <ellipse cx="30" cy="30" rx="8" ry="12" fill="#00a8cc" opacity="0.7" />
      </motion.svg>
    </motion.div>
  )
}

// Pufferfish Component
export function Pufferfish({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <motion.div
      className="absolute"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      <motion.svg
        width="60"
        height="60"
        viewBox="0 0 60 60"
        className="filter drop-shadow-lg"
        animate={{
          scale: [1, 1.1, 0.95, 1.05, 1],
          rotate: [0, 5, -5, 3, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Pufferfish body */}
        <circle cx="30" cy="30" r="25" fill="#ffd700" opacity="0.9" />
        {/* Spots */}
        <circle cx="25" cy="25" r="3" fill="#8b4513" opacity="0.6" />
        <circle cx="35" cy="28" r="2.5" fill="#8b4513" opacity="0.6" />
        <circle cx="28" cy="35" r="2" fill="#8b4513" opacity="0.6" />
        {/* Eye */}
        <circle cx="35" cy="28" r="4" fill="#000" />
        <circle cx="36" cy="27" r="1.5" fill="#fff" />
        {/* Mouth */}
        <path d="M 20 32 Q 25 35, 20 38" stroke="#000" strokeWidth="1.5" fill="none" />
      </motion.svg>
    </motion.div>
  )
}

// Squid Component
export function Squid({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <motion.div
      className="absolute"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      <motion.svg
        width="70"
        height="80"
        viewBox="0 0 70 80"
        className="filter drop-shadow-lg"
        animate={{
          y: [0, -10, 5, -8, 0],
          x: [0, 8, -5, 3, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Squid body */}
        <ellipse cx="35" cy="25" rx="20" ry="25" fill="#9370db" opacity="0.9" />
        {/* Tentacles */}
        <path d="M 20 45 Q 15 55, 18 60 Q 20 55, 20 45" fill="#7b68ee" opacity="0.8" />
        <path d="M 25 47 Q 22 57, 25 62 Q 27 57, 25 47" fill="#7b68ee" opacity="0.8" />
        <path d="M 35 48 Q 35 58, 35 63 Q 35 58, 35 48" fill="#7b68ee" opacity="0.8" />
        <path d="M 45 47 Q 48 57, 45 62 Q 43 57, 45 47" fill="#7b68ee" opacity="0.8" />
        <path d="M 50 45 Q 55 55, 52 60 Q 50 55, 50 45" fill="#7b68ee" opacity="0.8" />
        {/* Eyes */}
        <circle cx="30" cy="22" r="4" fill="#fff" />
        <circle cx="40" cy="22" r="4" fill="#fff" />
        <circle cx="30" cy="22" r="2" fill="#000" />
        <circle cx="40" cy="22" r="2" fill="#000" />
      </motion.svg>
    </motion.div>
  )
}

// Bannerfish Component
export function Bannerfish({ x, y, delay, direction = 'right' }: { x: number; y: number; delay: number; direction?: 'left' | 'right' }) {
  const swimPath = direction === 'right' 
    ? { x: [0, 50, 100, 150, 200], y: [0, -10, 5, -5, 0] }
    : { x: [0, -50, -100, -150, -200], y: [0, -10, 5, -5, 0] }
  
  return (
    <motion.div
      className="absolute"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      <motion.svg
        width="120"
        height="40"
        viewBox="0 0 120 40"
        className="filter drop-shadow-lg"
        animate={swimPath}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          transform: direction === 'left' ? 'scaleX(-1)' : 'none',
        }}
      >
        {/* Bannerfish body - elongated */}
        <ellipse cx="60" cy="20" rx="50" ry="12" fill="#ffd700" opacity="0.9" />
        {/* Stripes */}
        <line x1="40" y1="18" x2="40" y2="22" stroke="#ff8c00" strokeWidth="1.5" />
        <line x1="50" y1="17" x2="50" y2="23" stroke="#ff8c00" strokeWidth="1.5" />
        <line x1="60" y1="16" x2="60" y2="24" stroke="#ff8c00" strokeWidth="1.5" />
        <line x1="70" y1="17" x2="70" y2="23" stroke="#ff8c00" strokeWidth="1.5" />
        <line x1="80" y1="18" x2="80" y2="22" stroke="#ff8c00" strokeWidth="1.5" />
        {/* Long dorsal fin */}
        <path d="M 20 15 Q 30 5, 40 8 Q 50 5, 60 8 Q 70 5, 80 8 Q 90 5, 100 10" 
          fill="none" stroke="#ffd700" strokeWidth="2" opacity="0.8" />
        {/* Eye */}
        <circle cx="45" cy="18" r="3" fill="#000" />
        <circle cx="46" cy="17" r="1" fill="#fff" />
        {/* Tail */}
        <path d="M 100 20 Q 110 15, 115 20 Q 110 25, 100 20" fill="#ffd700" opacity="0.8" />
      </motion.svg>
    </motion.div>
  )
}

// Clownfish Component
export function Clownfish({ x, y, delay, direction = 'right' }: { x: number; y: number; delay: number; direction?: 'left' | 'right' }) {
  const swimPath = direction === 'right'
    ? { x: [0, 30, 60, 90, 120], y: [0, -5, 3, -3, 0] }
    : { x: [0, -30, -60, -90, -120], y: [0, -5, 3, -3, 0] }
  
  return (
    <motion.div
      className="absolute"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      <motion.svg
        width="60"
        height="40"
        viewBox="0 0 60 40"
        className="filter drop-shadow-lg"
        animate={swimPath}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          transform: direction === 'left' ? 'scaleX(-1)' : 'none',
        }}
      >
        {/* Clownfish body */}
        <ellipse cx="30" cy="20" rx="22" ry="12" fill="#ff6600" opacity="0.9" />
        {/* White stripes */}
        <path d="M 20 15 Q 25 20, 20 25" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        <path d="M 30 12 Q 35 20, 30 28" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        <path d="M 40 15 Q 45 20, 40 25" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        {/* Fins */}
        <ellipse cx="15" cy="18" rx="5" ry="8" fill="#ff6600" opacity="0.7" />
        <ellipse cx="15" cy="22" rx="5" ry="8" fill="#ff6600" opacity="0.7" />
        {/* Eye */}
        <circle cx="35" cy="18" r="3" fill="#000" />
        <circle cx="36" cy="17" r="1" fill="#fff" />
        {/* Tail */}
        <path d="M 50 20 Q 55 15, 58 20 Q 55 25, 50 20" fill="#ff6600" opacity="0.8" />
      </motion.svg>
    </motion.div>
  )
}

// Sponge Component
export function Sponge({ x, y, delay, color = 'yellow' }: { x: number; y: number; delay: number; color?: 'yellow' | 'orange' | 'purple' }) {
  const colors = {
    yellow: { main: '#ffd700', dark: '#daa520', light: '#ffff00' },
    orange: { main: '#ff8c00', dark: '#ff6347', light: '#ffa500' },
    purple: { main: '#9370db', dark: '#8b4789', light: '#ba55d3' },
  }
  const c = colors[color]
  
  return (
    <motion.div
      className="absolute"
      style={{ left: `${x}%`, bottom: `${y}%` }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
    >
      <motion.svg
        width="80"
        height="100"
        viewBox="0 0 80 100"
        className="filter drop-shadow-lg"
        animate={{
          y: [0, -2, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <defs>
          <linearGradient id={`spongeGrad-${x}-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={c.light} stopOpacity="0.9" />
            <stop offset="50%" stopColor={c.main} stopOpacity="0.85" />
            <stop offset="100%" stopColor={c.dark} stopOpacity="0.8" />
          </linearGradient>
        </defs>
        
        {/* Sponge body - irregular, organic shape */}
        <path
          d="M 40 100 Q 30 90, 25 80 Q 20 70, 22 60 Q 25 50, 30 45 Q 35 40, 40 35 Q 45 30, 50 35 Q 55 40, 58 45 Q 60 50, 58 60 Q 55 70, 50 80 Q 45 90, 40 100 Z"
          fill={`url(#spongeGrad-${x}-${color})`}
          stroke={c.dark}
          strokeWidth="1"
          opacity="0.9"
        />
        
        {/* Pores/holes */}
        {[...Array(15)].map((_, i) => {
          // Seeded random for consistent server/client rendering
          const seed = (x * 100 + y * 10 + i) % 1000
          const random1 = (seed * 9301 + 49297) % 233280 / 233280
          const random2 = ((seed + 1) * 9301 + 49297) % 233280 / 233280
          const angle = (i * 24) * Math.PI / 180
          const radius = 15 + random1 * 10
          // Round to avoid floating point precision issues
          const cx = Math.round((40 + Math.cos(angle) * radius) * 100) / 100
          const cy = Math.round((50 + Math.sin(angle) * radius) * 100) / 100
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={Math.round((2 + random2 * 2) * 100) / 100}
              fill={c.dark}
              opacity="0.6"
            />
          )
        })}
        
        {/* Texture lines */}
        <path
          d="M 30 60 Q 35 55, 40 60 Q 45 65, 50 60"
          fill="none"
          stroke={c.dark}
          strokeWidth="0.5"
          opacity="0.5"
        />
        <path
          d="M 25 70 Q 35 65, 45 70 Q 50 75, 55 70"
          fill="none"
          stroke={c.dark}
          strokeWidth="0.5"
          opacity="0.5"
        />
      </motion.svg>
    </motion.div>
  )
}

// Anemone Component
export function Anemone({ x, y, delay, color = 'green' }: { x: number; y: number; delay: number; color?: 'green' | 'purple' | 'pink' }) {
  const colors = {
    green: { main: '#32cd32', dark: '#228b22', light: '#90ee90' },
    purple: { main: '#9370db', dark: '#8b4789', light: '#ba55d3' },
    pink: { main: '#ff69b4', dark: '#ff1493', light: '#ffb6c1' },
  }
  const c = colors[color]
  
  return (
    <motion.div
      className="absolute"
      style={{ left: `${x}%`, bottom: `${y}%` }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
    >
      <motion.svg
        width="100"
        height="120"
        viewBox="0 0 100 120"
        className="filter drop-shadow-lg"
        animate={{
          rotate: [0, 3, -3, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <defs>
          <linearGradient id={`anemoneGrad-${x}-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={c.light} stopOpacity="0.9" />
            <stop offset="50%" stopColor={c.main} stopOpacity="0.85" />
            <stop offset="100%" stopColor={c.dark} stopOpacity="0.8" />
          </linearGradient>
        </defs>
        
        {/* Base/stem */}
        <ellipse cx="50" cy="110" rx="15" ry="10" fill={c.dark} opacity="0.8" />
        <path
          d="M 50 120 Q 45 110, 50 100 Q 55 110, 50 120"
          fill={`url(#anemoneGrad-${x}-${color})`}
          opacity="0.9"
        />
        
        {/* Tentacles - wavy, organic */}
        {[...Array(20)].map((_, i) => {
          const angle = (i * 18) * Math.PI / 180
          const baseX = 50
          // Seeded random for consistent server/client rendering
          const seed = (x * 100 + y * 10 + i) % 1000
          const random = (seed * 9301 + 49297) % 233280 / 233280
          const baseY = 100
          const length = 40 + random * 20
          const endX = baseX + Math.cos(angle) * length
          const endY = baseY - length + Math.sin(angle) * 10
          const midX = baseX + Math.cos(angle) * (length / 2)
          const midY = baseY - length / 2 + Math.sin(angle) * 5
          
          return (
            <motion.path
              key={i}
              d={`M ${baseX} ${baseY} Q ${midX} ${midY}, ${endX} ${endY}`}
              fill="none"
              stroke={c.main}
              strokeWidth="1.5"
              opacity="0.8"
              animate={{
                pathLength: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2 + random,
                repeat: Infinity,
                delay: i * 0.1,
                ease: 'easeInOut',
              }}
            />
          )
        })}
        
        {/* Center/mouth */}
        <circle cx="50" cy="60" r="8" fill={c.dark} opacity="0.7" />
        <circle cx="50" cy="60" r="5" fill={c.main} opacity="0.5" />
      </motion.svg>
    </motion.div>
  )
}

// Coral Component - Realistic designs
export function Coral({ x, y, type, delay }: { x: number; y: number; type: 'branch' | 'brain' | 'fan'; delay: number }) {
  if (type === 'branch') {
    return (
      <motion.div
        className="absolute"
        style={{ left: `${x}%`, bottom: `${y}%` }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay }}
      >
        <motion.svg
          width="140"
          height="180"
          viewBox="0 0 140 180"
          className="filter drop-shadow-2xl"
          animate={{
            y: [0, -3, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <defs>
            <linearGradient id={`branchGrad-${x}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ff6b9d" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#ff1493" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#c71585" stopOpacity="0.85" />
            </linearGradient>
            <filter id={`branchShadow-${x}`}>
              <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
              <feOffset dx="1" dy="2" result="offsetblur"/>
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.3"/>
              </feComponentTransfer>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Main trunk */}
          <path
            d="M 70 180 L 70 120 Q 68 115, 70 110 L 70 100"
            fill={`url(#branchGrad-${x})`}
            stroke="#ff1493"
            strokeWidth="1.5"
            filter={`url(#branchShadow-${x})`}
          />
          
          {/* Left branches - organic, varied */}
          <path
            d="M 70 140 Q 55 135, 45 125 Q 40 120, 35 110 Q 30 100, 25 90 Q 20 80, 18 70"
            fill="none"
            stroke={`url(#branchGrad-${x})`}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M 45 125 Q 50 115, 48 105 Q 46 95, 42 85"
            fill="none"
            stroke={`url(#branchGrad-${x})`}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M 35 110 Q 38 100, 36 90 Q 34 80, 30 70"
            fill="none"
            stroke={`url(#branchGrad-${x})`}
            strokeWidth="2"
            strokeLinecap="round"
          />
          
          {/* Right branches */}
          <path
            d="M 70 140 Q 85 135, 95 125 Q 100 120, 105 110 Q 110 100, 115 90 Q 120 80, 122 70"
            fill="none"
            stroke={`url(#branchGrad-${x})`}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M 95 125 Q 90 115, 92 105 Q 94 95, 98 85"
            fill="none"
            stroke={`url(#branchGrad-${x})`}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M 105 110 Q 102 100, 104 90 Q 106 80, 110 70"
            fill="none"
            stroke={`url(#branchGrad-${x})`}
            strokeWidth="2"
            strokeLinecap="round"
          />
          
          {/* Top branches */}
          <path
            d="M 70 100 Q 60 90, 55 80 Q 50 70, 48 60"
            fill="none"
            stroke={`url(#branchGrad-${x})`}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M 70 100 Q 80 90, 85 80 Q 90 70, 92 60"
            fill="none"
            stroke={`url(#branchGrad-${x})`}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          
          {/* Small polyps/details */}
          {[...Array(12)].map((_, i) => {
            // Seeded random for consistent server/client rendering
            const seed = (x * 100 + y * 10 + i) % 1000
            const random = (seed * 9301 + 49297) % 233280 / 233280
            const angle = (i * 30) * Math.PI / 180
            const radius = 3 + random * 2
            const cx = 70 + Math.cos(angle) * (20 + i * 3)
            const cy = 140 - i * 8
            return (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={radius}
                fill="#ff69b4"
                opacity="0.8"
              />
            )
          })}
        </motion.svg>
      </motion.div>
    )
  }

  if (type === 'brain') {
    return (
      <motion.div
        className="absolute"
        style={{ left: `${x}%`, bottom: `${y}%` }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay }}
      >
        <motion.svg
          width="120"
          height="100"
          viewBox="0 0 120 100"
          className="filter drop-shadow-2xl"
          animate={{
            y: [0, -2, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <defs>
            <linearGradient id={`brainGrad-${x}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff8c69" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#ff6347" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#cd5c5c" stopOpacity="0.85" />
            </linearGradient>
            <radialGradient id={`brainHighlight-${x}`} cx="40%" cy="30%">
              <stop offset="0%" stopColor="#ffa07a" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ff6347" stopOpacity="0.3" />
            </radialGradient>
          </defs>
          
          {/* Main brain coral body - organic, wavy */}
          <path
            d="M 10 50 Q 15 30, 30 25 Q 50 20, 70 25 Q 90 30, 110 50 Q 90 70, 70 75 Q 50 80, 30 75 Q 15 70, 10 50 Z"
            fill={`url(#brainGrad-${x})`}
            stroke="#ff6347"
            strokeWidth="1"
            opacity="0.9"
          />
          
          {/* Brain-like grooves - curved, organic */}
          <path
            d="M 20 35 Q 30 30, 40 32 Q 50 30, 60 32 Q 70 30, 80 35"
            fill="none"
            stroke="#ff4500"
            strokeWidth="1.5"
            opacity="0.7"
          />
          <path
            d="M 25 45 Q 35 40, 45 42 Q 55 40, 65 42 Q 75 40, 85 45"
            fill="none"
            stroke="#ff4500"
            strokeWidth="1.5"
            opacity="0.7"
          />
          <path
            d="M 20 55 Q 30 50, 40 52 Q 50 50, 60 52 Q 70 50, 80 55"
            fill="none"
            stroke="#ff4500"
            strokeWidth="1.5"
            opacity="0.7"
          />
          <path
            d="M 25 65 Q 35 60, 45 62 Q 55 60, 65 62 Q 75 60, 85 65"
            fill="none"
            stroke="#ff4500"
            strokeWidth="1.5"
            opacity="0.7"
          />
          
          {/* Vertical grooves */}
          <path
            d="M 35 30 Q 35 40, 35 50 Q 35 60, 35 70"
            fill="none"
            stroke="#ff4500"
            strokeWidth="1"
            opacity="0.6"
          />
          <path
            d="M 50 30 Q 50 40, 50 50 Q 50 60, 50 70"
            fill="none"
            stroke="#ff4500"
            strokeWidth="1"
            opacity="0.6"
          />
          <path
            d="M 65 30 Q 65 40, 65 50 Q 65 60, 65 70"
            fill="none"
            stroke="#ff4500"
            strokeWidth="1"
            opacity="0.6"
          />
          
          {/* Highlight */}
          <ellipse
            cx="45"
            cy="35"
            rx="25"
            ry="20"
            fill={`url(#brainHighlight-${x})`}
            opacity="0.5"
          />
        </motion.svg>
      </motion.div>
    )
  }

  // Fan coral - more realistic
  return (
    <motion.div
      className="absolute"
      style={{ left: `${x}%`, bottom: `${y}%` }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
    >
      <motion.svg
        width="100"
        height="140"
        viewBox="0 0 100 140"
        className="filter drop-shadow-2xl"
        animate={{
          rotate: [0, 2, -2, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <defs>
          <linearGradient id={`fanGrad-${x}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#20b2aa" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#48d1cc" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#008b8b" stopOpacity="0.8" />
          </linearGradient>
          <radialGradient id={`fanRadial-${x}`} cx="50%" cy="30%">
            <stop offset="0%" stopColor="#7fffd4" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#008b8b" stopOpacity="0.2" />
          </radialGradient>
        </defs>
        
        {/* Main fan structure */}
        <ellipse
          cx="50"
          cy="70"
          rx="42"
          ry="60"
          fill={`url(#fanGrad-${x})`}
          stroke="#008b8b"
          strokeWidth="1"
          opacity="0.85"
        />
        
        {/* Central rib */}
        <path
          d="M 50 10 L 50 130"
          stroke="#008b8b"
          strokeWidth="2"
          opacity="0.7"
        />
        
        {/* Left side ribs - curved, organic */}
        <path
          d="M 50 20 Q 35 30, 25 40 Q 20 50, 18 60 Q 20 70, 25 80 Q 30 90, 40 100"
          fill="none"
          stroke="#008b8b"
          strokeWidth="1.5"
          opacity="0.7"
        />
        <path
          d="M 50 30 Q 38 38, 30 48 Q 25 58, 23 68 Q 25 78, 30 88 Q 35 98, 42 108"
          fill="none"
          stroke="#008b8b"
          strokeWidth="1.5"
          opacity="0.7"
        />
        <path
          d="M 50 40 Q 42 46, 36 56 Q 32 66, 31 76 Q 32 86, 36 96 Q 40 106, 46 116"
          fill="none"
          stroke="#008b8b"
          strokeWidth="1.5"
          opacity="0.7"
        />
        
        {/* Right side ribs */}
        <path
          d="M 50 20 Q 65 30, 75 40 Q 80 50, 82 60 Q 80 70, 75 80 Q 70 90, 60 100"
          fill="none"
          stroke="#008b8b"
          strokeWidth="1.5"
          opacity="0.7"
        />
        <path
          d="M 50 30 Q 62 38, 70 48 Q 75 58, 77 68 Q 75 78, 70 88 Q 65 98, 58 108"
          fill="none"
          stroke="#008b8b"
          strokeWidth="1.5"
          opacity="0.7"
        />
        <path
          d="M 50 40 Q 58 46, 64 56 Q 68 66, 69 76 Q 68 86, 64 96 Q 60 106, 54 116"
          fill="none"
          stroke="#008b8b"
          strokeWidth="1.5"
          opacity="0.7"
        />
        
        {/* Mesh pattern - fine lines */}
        {[...Array(8)].map((_, i) => {
          const yPos = 30 + i * 12
          return (
            <path
              key={i}
              d={`M 20 ${yPos} Q 50 ${yPos + 5}, 80 ${yPos}`}
              fill="none"
              stroke="#008b8b"
              strokeWidth="0.5"
              opacity="0.4"
            />
          )
        })}
        
        {/* Highlight */}
        <ellipse
          cx="50"
          cy="50"
          rx="30"
          ry="40"
          fill={`url(#fanRadial-${x})`}
        />
      </motion.svg>
    </motion.div>
  )
}


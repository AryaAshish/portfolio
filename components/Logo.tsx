'use client'

import Link from 'next/link'
import Image from 'next/image'

interface LogoProps {
  className?: string
  size?: number
}

export function Logo({ className = '', size = 40 }: LogoProps) {
  return (
    <Link href="/" className={`inline-block ${className}`} aria-label="Home">
      <Image
        src="/logiimg.jpg"
        alt="Musafir Codes Logo"
        width={size}
        height={size}
        className="rounded-full drop-shadow-lg object-cover"
        style={{ width: size, height: size }}
        priority
      />
    </Link>
  )
}


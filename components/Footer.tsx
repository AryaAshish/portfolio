import Link from 'next/link'

const socialLinks = [
  { href: 'https://linkedin.com/in/aryanashish', label: 'LinkedIn', external: true },
  { href: 'https://leetcode.com/u/aryanAshish/', label: 'LeetCode', external: true },
  { href: 'https://www.instagram.com/musafir.codes/', label: 'Instagram', external: true },
]

export function Footer() {
  return (
    <footer className="bg-ocean-deep text-neutral-white py-12 border-t border-ocean-dark/30 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif text-xl text-neutral-white mb-4 heading-serif">Portfolio</h3>
            <p className="text-sm text-neutral-white/80 leading-relaxed">
              Engineer by craft. Diver by soul. Rider by heart.
            </p>
          </div>
          <div>
            <h3 className="font-serif text-xl text-neutral-white mb-4 heading-serif">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-neutral-white/80 hover:text-teal-light transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/experience" className="text-neutral-white/80 hover:text-teal-light transition-colors">
                  Experience
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-neutral-white/80 hover:text-teal-light transition-colors">
                  Writing
                </Link>
              </li>
              <li>
                <Link href="/prep" className="text-neutral-white/80 hover:text-teal-light transition-colors">
                  Prep Paths
                </Link>
              </li>
              <li>
                <Link href="/life" className="text-neutral-white/80 hover:text-teal-light transition-colors">
                  Life
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-neutral-white/80 hover:text-teal-light transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-serif text-xl text-neutral-white mb-4 heading-serif">Connect</h3>
            <ul className="space-y-2 text-sm">
              {socialLinks.map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-white/80 hover:text-teal-light transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href} className="text-neutral-white/80 hover:text-teal-light transition-colors">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-ocean-dark/30 text-center text-sm text-neutral-white/70">
          <p>&copy; {new Date().getFullYear()} Portfolio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}



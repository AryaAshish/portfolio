import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          deep: 'var(--color-ocean-deep)',
          dark: 'var(--color-ocean-dark)',
          base: 'var(--color-ocean-base)',
          light: 'var(--color-ocean-light)',
          pale: 'var(--color-ocean-pale)',
        },
        teal: {
          dark: 'var(--color-teal-dark)',
          base: 'var(--color-teal-base)',
          light: 'var(--color-teal-light)',
        },
        neutral: {
          off: 'var(--color-neutral-off)',
          white: 'var(--color-neutral-white)',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'bubble': 'bubble 8s ease-in-out infinite',
        'fade-in': 'fadeIn 1s ease-in',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        bubble: {
          '0%': { transform: 'translateY(0px) scale(1)', opacity: '0.7' },
          '50%': { transform: 'translateY(-100px) scale(1.2)', opacity: '1' },
          '100%': { transform: 'translateY(-200px) scale(0.8)', opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
export default config




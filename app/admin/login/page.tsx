import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyCookie } from '@/lib/auth/cookie'
import { LoginForm } from './LoginForm'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Sign in',
  robots: { index: false, follow: false },
}

export default async function LoginPage() {
  const store = cookies()
  const adminRaw = store.get('admin_session')?.value
  const ftRaw = store.get('ft_session')?.value

  if (adminRaw) {
    const session = await verifyCookie(adminRaw)
    if (session?.role === 'admin') redirect('/admin')
  }
  if (ftRaw) {
    const session = await verifyCookie(ftRaw)
    if (session?.role === 'fittrack') redirect('/fittrack')
  }

  return (
    <div className="min-h-screen bg-neutral-off flex items-center justify-center px-4 py-12">
      <div className="bg-neutral-white rounded-xl p-8 shadow-lg max-w-md w-full">
        <h1 className="font-serif text-3xl text-ocean-deep mb-2">Sign in</h1>
        <p className="text-sm text-ocean-base mb-6">
          Enter your credentials to continue.
        </p>
        <LoginForm />
      </div>
    </div>
  )
}

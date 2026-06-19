'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      // Redirect to role-specific dashboard
      switch (user.role) {
        case 'customer':
        case 'captain':
          router.push('/customer-dashboard')
          break
        case 'organizer':
          router.push('/organizer')
          break
        case 'owner':
          router.push('/owner')
          break
      }
    } else if (!isLoading && !user) {
      router.push('/auth')
    }
  }, [user, isLoading, router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
        <p className="mt-4 text-white/60">Loading...</p>
      </div>
    </div>
  )
}

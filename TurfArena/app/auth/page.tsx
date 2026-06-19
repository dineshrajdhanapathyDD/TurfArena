'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { useAuth } from '@/TurfArena/lib/auth-context'

export default function AuthPage() {
  const router = useRouter()
  const { login, isLoading } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('customer@turf.com')
  const [password, setPassword] = useState('customer123')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      await login(email, password)
      router.push('/home')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  const testAccounts = [
    { email: 'customer@turf.com', password: 'customer123', role: 'Customer' },
    { email: 'organizer@turf.com', password: 'organizer123', role: 'Organizer' },
    { email: 'owner@turf.com', password: 'owner123', role: 'Owner' },
  ]

  const fillTestAccount = (testEmail: string, testPassword: string) => {
    setEmail(testEmail)
    setPassword(testPassword)
  }

  return (
    <AppShell withNav={false} className="flex min-h-dvh items-center justify-center px-5 relative overflow-hidden">
      {/* Stadium background image with dark overlay */}
      <div 
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/images/auth-bg.png)',
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Glass card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-b from-teal-700/30 to-teal-800/40 p-8 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center mb-4 mx-auto"
            >
              <span className="text-xl font-bold text-white">T</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold tracking-tight text-white"
            >
              TurfArena
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-2 text-sm text-white/80"
            >
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setError('')
                }}
                className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                {isSignUp ? 'Sign In' : 'Create Account'}
              </button>
            </motion.p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-red-600/20 border border-red-400/30 rounded-lg p-3 flex items-gap-2 text-sm text-red-300"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.form
              key={isSignUp ? 'signup' : 'signin'}
              initial={{ opacity: 0, x: isSignUp ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isSignUp ? -20 : 20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Name field (signup only) */}
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-white/90">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full rounded-lg border border-white/30 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/50 backdrop-blur transition-all focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                    required
                  />
                </motion.div>
              )}

              {/* Email field */}
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-white/90">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-white/30 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/50 backdrop-blur transition-all focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                  required
                />
              </div>

              {/* Password field */}
              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-white/90">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-lg border border-white/30 bg-white/10 px-4 py-3 pr-11 text-sm text-white placeholder:text-white/50 backdrop-blur transition-all focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>
              </div>

              {/* Forgot password (signin only) */}
              {!isSignUp && (
                <div className="text-right">
                  <button
                    type="button"
                    className="text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors underline"
                  >
                    Forgot Password
                  </button>
                </div>
              )}

              {/* Submit button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileTap={{ scale: 0.97 }}
                className="w-full rounded-lg bg-teal-600 hover:bg-teal-700 disabled:opacity-50 py-3 text-base font-semibold text-white transition-colors mt-8"
              >
                {isLoading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
              </motion.button>

              {/* Divider */}
              <div className="flex items-center gap-4 py-2">
                <div className="h-px flex-1 bg-white/20" />
                <span className="text-xs font-medium text-white/60">or</span>
                <div className="h-px flex-1 bg-white/20" />
              </div>

              {/* Social buttons */}
              <div className="flex gap-4 justify-center">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow"
                >
                  <svg className="size-6" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </motion.button>

                <motion.button
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow"
                >
                  <svg className="size-6" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </motion.button>
              </div>
            </motion.form>
          </AnimatePresence>

          {/* Test Credentials */}
          {!isSignUp && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 pt-6 border-t border-white/20"
            >
              <p className="text-xs font-medium text-white/60 mb-3 text-center">Test Credentials</p>
              <div className="space-y-2">
                {testAccounts.map((account) => (
                  <motion.button
                    key={account.email}
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={() => fillTestAccount(account.email, account.password)}
                    className="w-full text-xs px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white/80 transition-colors"
                  >
                    {account.role}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AppShell>
  )
}

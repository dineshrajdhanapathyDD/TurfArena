'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type UserRole = 'customer' | 'organizer' | 'owner'

export type User = {
  id: string
  email: string
  name: string
  role: UserRole
  avatar: string
  credits: number
  joinedAt: string
}

export type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

// Test credentials
const TEST_USERS: Record<string, { password: string; user: User }> = {
  'customer@turf.com': {
    password: 'customer123',
    user: {
      id: 'u1',
      email: 'customer@turf.com',
      name: 'Tani Sharma',
      role: 'customer',
      avatar: '/images/player-1.png',
      credits: 5000,
      joinedAt: '2024-01-15',
    },
  },
  'organizer@turf.com': {
    password: 'organizer123',
    user: {
      id: 'u2',
      email: 'organizer@turf.com',
      name: 'Priya Patel',
      role: 'organizer',
      avatar: '/images/player-2.png',
      credits: 15000,
      joinedAt: '2023-06-20',
    },
  },
  'owner@turf.com': {
    password: 'owner123',
    user: {
      id: 'u3',
      email: 'owner@turf.com',
      name: 'Rajesh Kumar',
      role: 'owner',
      avatar: '/images/player-3.png',
      credits: 25000,
      joinedAt: '2023-01-10',
    },
  },
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is stored in localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('turf_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (err) {
        console.error('Failed to parse stored user:', err)
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Reduced API delay from 500ms to 100ms
      await new Promise(resolve => setTimeout(resolve, 100))

      const credentials = TEST_USERS[email]
      if (!credentials || credentials.password !== password) {
        throw new Error('Invalid email or password')
      }

      const userData = credentials.user
      setUser(userData)
      localStorage.setItem('turf_user', JSON.stringify(userData))
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('turf_user')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

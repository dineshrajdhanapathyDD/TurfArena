import { NextResponse } from 'next/server'
import { TABLES, scanItems, AWS_ENABLED } from '@/lib/aws'
import type { PlayerRecord } from '@/lib/aws'

// Test credentials (mirrors auth-context.tsx)
const TEST_USERS: Record<string, { password: string; role: string; id: string; name: string }> = {
  'customer@turf.com': { password: 'customer123', role: 'customer', id: 'u1', name: 'Tani Sharma' },
  'captain@turf.com': { password: 'captain123', role: 'captain', id: 'u4', name: 'Arjun Mehta' },
  'organizer@turf.com': { password: 'organizer123', role: 'organizer', id: 'u2', name: 'Priya Patel' },
  'owner@turf.com': { password: 'owner123', role: 'owner', id: 'u3', name: 'Rajesh Kumar' },
}

// POST /api/auth/login — Authenticate user and return session token
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check test credentials
    const testUser = TEST_USERS[email]
    if (!testUser || testUser.password !== password) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // In production: verify against DynamoDB + bcrypt hashed password
    // In production: use JWT or session token
    const sessionToken = `ta_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`

    const response = {
      success: true,
      data: {
        token: sessionToken,
        user: {
          id: testUser.id,
          email,
          name: testUser.name,
          role: testUser.role,
        },
        expiresIn: 86400, // 24 hours
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('[API Error] POST /api/auth/login:', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}

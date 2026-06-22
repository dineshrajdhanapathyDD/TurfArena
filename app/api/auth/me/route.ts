import { NextResponse } from 'next/server'

// GET /api/auth/me — Get current user from token (validates session)
export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Provide Bearer token.' },
      { status: 401 }
    )
  }

  const token = authHeader.slice(7)

  // In production: verify JWT signature / lookup session in DynamoDB
  // For demo: any token starting with 'ta_' is valid
  if (!token.startsWith('ta_')) {
    return NextResponse.json(
      { success: false, error: 'Invalid or expired token' },
      { status: 401 }
    )
  }

  // Return mock user (in production: decode JWT claims)
  return NextResponse.json({
    success: true,
    data: {
      id: 'u1',
      email: 'customer@turf.com',
      name: 'Tani Sharma',
      role: 'customer',
      authenticated: true,
      tokenValid: true,
    },
  })
}

import { NextResponse } from 'next/server'
import { teamRoster } from '@/lib/data'

// GET /api/teams - List teams
export async function GET() {
  // In production: query DynamoDB TEAMS table
  const teams = [
    {
      teamId: 'team1',
      teamName: 'Thunder FC',
      captainId: 'r1',
      city: 'Bengaluru',
      sport: 'football',
      members: teamRoster.length,
      wins: 41,
      losses: 23,
      ranking: 1,
    },
    {
      teamId: 'team2',
      teamName: 'Strikers United',
      captainId: 'p2',
      city: 'Bengaluru',
      sport: 'football',
      members: 8,
      wins: 38,
      losses: 26,
      ranking: 2,
    },
    {
      teamId: 'team3',
      teamName: 'Phoenix XI',
      captainId: 'p3',
      city: 'Mumbai',
      sport: 'football',
      members: 9,
      wins: 35,
      losses: 29,
      ranking: 3,
    },
  ]

  return NextResponse.json({ success: true, data: teams, total: teams.length })
}

// POST /api/teams - Create a team
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { teamName, captainId, sport, city } = body

    if (!teamName || !captainId || !sport) {
      return NextResponse.json(
        { success: false, error: 'teamName, captainId, and sport are required' },
        { status: 400 }
      )
    }

    const newTeam = {
      teamId: `team_${Date.now()}`,
      teamName,
      captainId,
      sport,
      city: city || 'Unknown',
      members: 1,
      wins: 0,
      losses: 0,
      ranking: null,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({ success: true, data: newTeam }, { status: 201 })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    )
  }
}

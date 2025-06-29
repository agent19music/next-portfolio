import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import supabase from '@/lib/supabase'

// Valid palette types
const VALID_PALETTES = ['muder', 'monochrome', 'sunset', 'calm', 'lilac', 'mocha'] as const
type ValidPalette = typeof VALID_PALETTES[number]

// Hash IP address for privacy
function hashIP(ip: string): string {
  return crypto.createHash('sha256').update(ip).digest('hex')
}

// Get client IP address
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return 'unknown'
}

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is properly configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Supabase environment variables not configured')
      return NextResponse.json(
        { error: 'Database service not available' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { palette, isDarkMode, sessionId } = body

    // Validate required fields
    if (!palette || typeof isDarkMode !== 'boolean') {
      return NextResponse.json(
        { error: 'Missing or invalid required fields' },
        { status: 400 }
      )
    }

    // Validate palette value
    if (!VALID_PALETTES.includes(palette as ValidPalette)) {
      return NextResponse.json(
        { error: 'Invalid palette value' },
        { status: 400 }
      )
    }

    // Get client information
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const clientIP = getClientIP(request)
    const ipHash = hashIP(clientIP)

    // Insert preference into database
    const { data, error } = await supabase
      .from('preferences')
      .insert({
        palette,
        is_dark_mode: isDarkMode,
        user_agent: userAgent,
        ip_hash: ipHash,
        session_id: sessionId || null
      })
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to save preference' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Preference saved successfully',
        id: data[0]?.id 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Optional: GET endpoint for analytics (requires authentication)
export async function GET(request: NextRequest) {
  try {
    // Check if Supabase is properly configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Supabase environment variables not configured')
      return NextResponse.json(
        { error: 'Database service not available' },
        { status: 503 }
      )
    }

    // Get aggregated data (no personal info)
    const { data, error } = await supabase
      .from('preferences')
      .select('palette, is_dark_mode, created_at')
      .order('created_at', { ascending: false })
      .limit(1000) // Limit for performance

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch preferences' },
        { status: 500 }
      )
    }

    // Aggregate the data
    const stats = data.reduce((acc: any, pref) => {
      // Count palettes
      acc.palettes[pref.palette] = (acc.palettes[pref.palette] || 0) + 1
      
      // Count dark mode usage
      if (pref.is_dark_mode) {
        acc.darkMode.enabled++
      } else {
        acc.darkMode.disabled++
      }
      
      acc.total++
      return acc
    }, {
      palettes: {},
      darkMode: { enabled: 0, disabled: 0 },
      total: 0
    })

    return NextResponse.json({ stats }, { status: 200 })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
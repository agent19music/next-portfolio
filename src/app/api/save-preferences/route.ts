import { NextRequest, NextResponse } from 'next/server'
import supabase from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

// Valid palette types
const VALID_PALETTES = ['muder', 'monochrome', 'sunset', 'calm', 'lilac', 'mocha'] as const
type ValidPalette = typeof VALID_PALETTES[number]

// Helper function to generate session ID
function generateSessionId(): string {
  return 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15)
}

// Create server-side Supabase client for consistent API usage
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const serverSupabase = createClient(supabaseUrl, supabaseAnonKey)

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is properly configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.SUPABASE_URL) {
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

    // Get user agent and generate session ID if not provided
    const userAgent = request.headers.get('user-agent') || 'Unknown'
    const finalSessionId = sessionId || generateSessionId()

    // Record individual selection for detailed analytics
    const { error: selectionError } = await serverSupabase
      .from('palette_selections')
      .insert({
        palette,
        is_dark_mode: isDarkMode,
        session_id: finalSessionId,
        user_agent: userAgent
      })

    if (selectionError) {
      console.error('Error recording palette selection:', selectionError)
      // Continue with aggregate update even if individual recording fails
    }

    // Check if this combination already exists
    const { data: existing, error: selectError } = await supabase
      .from('palette_preferences')
      .select('id, counter')
      .eq('palette', palette)
      .eq('is_dark_mode', isDarkMode)
      .single()

    if (selectError && selectError.code !== 'PGRST116') {
      // PGRST116 is "not found" error, which is expected for new combinations
      console.error('Supabase select error:', selectError)
      return NextResponse.json(
        { error: 'Failed to check existing preference' },
        { status: 500 }
      )
    }

    if (existing) {
      // Update counter for existing combination
      const { data, error } = await supabase
        .from('palette_preferences')
        .update({ 
          counter: existing.counter + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select()

      if (error) {
        console.error('Supabase update error:', error)
        return NextResponse.json(
          { error: 'Failed to update preference' },
          { status: 500 }
        )
      }

      return NextResponse.json(
        { 
          success: true, 
          message: 'Preference updated successfully',
          id: existing.id,
          counter: existing.counter + 1,
          sessionId: finalSessionId
        },
        { status: 200 }
      )
    } else {
      // Insert new preference combination
      const { data, error } = await supabase
        .from('palette_preferences')
        .insert({
          palette,
          is_dark_mode: isDarkMode,
          counter: 1
        })
        .select()

      if (error) {
        console.error('Supabase insert error:', error)
        return NextResponse.json(
          { error: 'Failed to save preference' },
          { status: 500 }
        )
      }

      return NextResponse.json(
        { 
          success: true, 
          message: 'Preference saved successfully',
          id: data[0]?.id,
          counter: 1,
          sessionId: finalSessionId
        },
        { status: 201 }
      )
    }

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint for analytics
export async function GET(request: NextRequest) {
  try {
    // Check if Supabase is properly configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.SUPABASE_URL) {
      console.error('Supabase environment variables not configured')
      return NextResponse.json(
        { error: 'Database service not available' },
        { status: 503 }
      )
    }

    // Get aggregate preference data
    const { data: preferences, error: prefError } = await serverSupabase
      .from('palette_preferences')
      .select('*')
      .order('counter', { ascending: false })

    if (prefError) {
      console.error('Supabase preferences error:', prefError)
      return NextResponse.json(
        { error: 'Failed to fetch preferences' },
        { status: 500 }
      )
    }

    // Get individual selections for detailed analytics
    const { data: selections, error: selectError } = await serverSupabase
      .from('palette_selections')
      .select('*')
      .order('created_at', { ascending: false })

    if (selectError) {
      console.error('Supabase selections error:', selectError)
      return NextResponse.json(
        { error: 'Failed to fetch selections' },
        { status: 500 }
      )
    }

    // Calculate comprehensive stats
    const totalVotes = preferences.reduce((sum, pref) => sum + pref.counter, 0)
    const totalSelections = selections.length
    const uniqueSessions = new Set(selections.map(s => s.session_id)).size

    // Palette stats from aggregated data
    const paletteStats = preferences.reduce((acc: any, pref) => {
      if (!acc[pref.palette]) {
        acc[pref.palette] = { light: 0, dark: 0, total: 0 }
      }
      if (pref.is_dark_mode) {
        acc[pref.palette].dark += pref.counter
      } else {
        acc[pref.palette].light += pref.counter
      }
      acc[pref.palette].total += pref.counter
      return acc
    }, {})

    // Time-based analytics from selections
    const last24Hours = selections.filter(s => 
      new Date(s.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    )
    const last7Days = selections.filter(s => 
      new Date(s.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    )

    // Most popular palettes in different time periods
    const getMostPopular = (selectionList: any[]) => {
      const counts = selectionList.reduce((acc: any, sel) => {
        acc[sel.palette] = (acc[sel.palette] || 0) + 1
        return acc
      }, {})
      return Object.entries(counts)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 3)
        .map(([palette, count]) => ({ palette, count }))
    }

    return NextResponse.json({ 
      // Legacy data for backwards compatibility
      data: preferences,
      
      // Comprehensive analytics
      analytics: {
        summary: {
          totalVotes,
          totalSelections,
          uniqueSessions,
          uniqueCombinations: preferences.length
        },
        paletteStats,
        trends: {
          last24Hours: {
            count: last24Hours.length,
            popular: getMostPopular(last24Hours)
          },
          last7Days: {
            count: last7Days.length,
            popular: getMostPopular(last7Days)
          },
          allTime: {
            count: totalSelections,
            popular: getMostPopular(selections)
          }
        },
        recentSelections: selections.slice(0, 10), // Last 10 selections
        sessionStats: {
          totalSessions: uniqueSessions,
          avgSelectionsPerSession: uniqueSessions > 0 ? (totalSelections / uniqueSessions).toFixed(2) : 0
        }
      },
      
      // Raw data for detailed analysis
      preferences,
      selections: selections.slice(0, 50) // Last 50 for performance
    }, { status: 200 })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
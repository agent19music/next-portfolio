import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create server-side Supabase client
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function GET(request: NextRequest) {
  try {
    // Get comprehensive analytics data
    const [preferencesResult, selectionsResult] = await Promise.all([
      supabase
        .from('palette_preferences')
        .select('*')
        .order('counter', { ascending: false }),
      supabase
        .from('palette_selections')
        .select('*')
        .order('created_at', { ascending: false })
    ])

    if (preferencesResult.error) {
      throw preferencesResult.error
    }

    if (selectionsResult.error) {
      throw selectionsResult.error
    }

    const preferences = preferencesResult.data || []
    const selections = selectionsResult.data || []

    // Calculate comprehensive stats
    const totalVotes = preferences.reduce((sum, pref) => sum + pref.counter, 0)
    const totalSelections = selections.length
    const uniqueSessions = new Set(selections.map(s => s.session_id)).size

    // Palette popularity ranking
    const palettePopularity = preferences.map(pref => ({
      palette: pref.palette,
      isDarkMode: pref.is_dark_mode,
      votes: pref.counter,
      percentage: totalVotes > 0 ? ((pref.counter / totalVotes) * 100).toFixed(1) : '0'
    }))

    // Recent activity (last 24 hours)
    const recentActivity = selections
      .filter(s => new Date(s.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000))
      .slice(0, 10)

    // Top palettes overall
    const paletteRanking = selections.reduce((acc: any, sel) => {
      acc[sel.palette] = (acc[sel.palette] || 0) + 1
      return acc
    }, {})

    const topPalettes = Object.entries(paletteRanking)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([palette, count]) => ({ palette, selections: count }))

    // Session insights
    const sessionInsights = {
      totalSessions: uniqueSessions,
      avgSelectionsPerSession: uniqueSessions > 0 ? (totalSelections / uniqueSessions).toFixed(2) : 0,
      mostActiveSession: selections.reduce((acc, sel) => {
        acc[sel.session_id] = (acc[sel.session_id] || 0) + 1
        return acc
      }, {} as any)
    }

    const mostActiveSessionId = Object.entries(sessionInsights.mostActiveSession)
      .sort(([,a], [,b]) => (b as number) - (a as number))[0]

    return NextResponse.json({
      success: true,
      dashboard: {
        summary: {
          totalVotes,
          totalSelections,
          uniqueSessions,
          uniqueCombinations: preferences.length
        },
        popularity: {
          ranking: palettePopularity,
          topPalettes
        },
        activity: {
          recent: recentActivity,
          mostActiveSession: mostActiveSessionId ? {
            sessionId: mostActiveSessionId[0],
            selections: mostActiveSessionId[1]
          } : null
        },
        insights: sessionInsights
      },
      // Raw data for detailed analysis
      data: {
        preferences,
        recentSelections: selections.slice(0, 20)
      }
    })

  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}
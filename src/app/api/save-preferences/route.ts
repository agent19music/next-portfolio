import { NextRequest, NextResponse } from 'next/server'
import supabase from '@/lib/supabase'

// Valid palette types
const VALID_PALETTES = ['muder', 'monochrome', 'sunset', 'calm', 'lilac', 'mocha'] as const
type ValidPalette = typeof VALID_PALETTES[number]

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
    const { palette, isDarkMode } = body

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
          counter: existing.counter + 1
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
          counter: 1
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
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Supabase environment variables not configured')
      return NextResponse.json(
        { error: 'Database service not available' },
        { status: 503 }
      )
    }

    // Get all preference data
    const { data, error } = await supabase
      .from('palette_preferences')
      .select('*')
      .order('counter', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch preferences' },
        { status: 500 }
      )
    }

    // Calculate totals
    const totalVotes = data.reduce((sum, pref) => sum + pref.counter, 0)
    const paletteStats = data.reduce((acc: any, pref) => {
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

    return NextResponse.json({ 
      data,
      stats: {
        totalVotes,
        paletteStats,
        uniqueCombinations: data.length
      }
    }, { status: 200 })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
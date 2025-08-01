import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function POST(request: NextRequest) {
  try {
    const { 
      event_name,
      session_id,
      user_agent,
      parameters,
      page_url,
      timestamp 
    } = await request.json()

    if (!event_name) {
      return NextResponse.json(
        { error: 'Event name is required' },
        { status: 400 }
      )
    }

    // Insert event into analytics_events table
    const { data, error } = await supabase
      .from('analytics_events')
      .insert({
        event_name,
        page_url,
        user_agent,
        timestamp: timestamp || new Date().toISOString(),
        parameters: parameters || {},
        session_id,
        created_at: new Date().toISOString()
      })
      .select()

    if (error) {
      console.error('Error saving analytics event:', error)
      return NextResponse.json(
        { error: 'Failed to save analytics event' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      eventId: data[0]?.id
    })

  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const event_name = searchParams.get('event_name')
    const limit = parseInt(searchParams.get('limit') || '100')
    const start_date = searchParams.get('start_date')
    const end_date = searchParams.get('end_date')

    let query = supabase
      .from('analytics_events')
      .select('*')

    if (event_name) {
      query = query.eq('event_name', event_name)
    }

    if (start_date) {
      query = query.gte('created_at', start_date)
    }

    if (end_date) {
      query = query.lte('created_at', end_date)
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching analytics events:', error)
      return NextResponse.json(
        { error: 'Failed to fetch analytics events' },
        { status: 500 }
      )
    }

    // Calculate some basic stats
    const stats = {
      total_events: data.length,
      unique_sessions: new Set(data.map(event => event.session_id)).size,
      event_counts: data.reduce((acc: any, event) => {
        acc[event.event_name] = (acc[event.event_name] || 0) + 1
        return acc
      }, {}),
      recent_events: data.slice(0, 10)
    }

    return NextResponse.json({
      success: true,
      data,
      stats
    })

  } catch (error) {
    console.error('Analytics GET API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
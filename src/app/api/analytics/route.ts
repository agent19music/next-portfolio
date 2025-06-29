import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const eventType = searchParams.get('event') || 'all';
  const days = parseInt(searchParams.get('days') || '30');

  try {
    let query = supabase
      .from('analytics_events')
      .select('*')
      .gte('timestamp', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('timestamp', { ascending: false });

    if (eventType !== 'all') {
      query = query.eq('event_name', eventType);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      events: data,
      summary: {
        totalEvents: data.length,
        uniqueSessions: new Set(data.map(e => e.session_id)).size,
        
        timeRange: `${days} days`
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  try {
    const { data, error } = await supabase
      .from('analytics_events')
      .insert({
        event_name: body.eventName,
        page_url: body.pageUrl,
        user_agent: body.userAgent,
        parameters: body.parameters,
        session_id: body.sessionId
      });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to store analytics' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function POST(request: NextRequest) {
  try {
    const { token, deviceType = 'android' } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'FCM token is required' },
        { status: 400 }
      )
    }

    // Check if token already exists
    const { data: existingToken, error: checkError } = await supabase
      .from('fcm_tokens')
      .select('id')
      .eq('token', token)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing token:', checkError)
      return NextResponse.json(
        { error: 'Failed to check existing token' },
        { status: 500 }
      )
    }

    if (existingToken) {
      return NextResponse.json({ 
        success: true, 
        message: 'Token already registered',
        tokenId: existingToken.id 
      })
    }

    // Insert new token
    const { data, error } = await supabase
      .from('fcm_tokens')
      .insert({
        token,
        user_id: null // For anonymous users
      })
      .select()

    if (error) {
      console.error('Error saving FCM token:', error)
      return NextResponse.json(
        { error: 'Failed to save FCM token' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'FCM token registered successfully',
      tokenId: data[0]?.id
    })

  } catch (error) {
    console.error('FCM token API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'FCM token is required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('fcm_tokens')
      .delete()
      .eq('token', token)

    if (error) {
      console.error('Error deleting FCM token:', error)
      return NextResponse.json(
        { error: 'Failed to delete FCM token' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'FCM token removed successfully'
    })

  } catch (error) {
    console.error('FCM token deletion API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
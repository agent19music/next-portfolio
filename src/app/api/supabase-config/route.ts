import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Environment variables accessed server-side without NEXT_PUBLIC_ prefix
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Simple validation
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase environment variables are not properly configured");
}

// Create a Supabase client singleton for the API route
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to get location from IP (minimal tracking for context)
async function getLocationFromIP(ip: string) {
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=country,city,status`);
    const data = await response.json();
    
    if (data.status === 'success') {
      return {
        country: data.country,
        city: data.city
      };
    }
  } catch (error) {
    console.error('Error fetching location:', error);
  }
  
  return { country: null, city: null };
}

export async function POST(request: Request) {
  try {
    // Extract the message data from the request
    const { message, imageUrl } = await request.json();
    
    // Validate that message is provided (images are optional)
    const trimmedMessage = message?.trim();
    if (!trimmedMessage) {
      return NextResponse.json({ 
        error: "Message text is required" 
      }, { status: 400 });
    }

    // Get minimal location data for notification context only
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const cfConnectingIP = request.headers.get('cf-connecting-ip');
    const ip = cfConnectingIP || forwardedFor?.split(',')[0] || realIP || 'unknown';
    
    // Get location data for notification context
    const { country, city } = await getLocationFromIP(ip);
    
    console.log('📍 Location detected for notification context:', { country, city });
    
    // Insert message into database with minimal data
    const { data, error } = await supabase
      .from("anonymous_messages")
      .insert([
        {
          message: trimmedMessage,
          image_url: imageUrl || null,
          country: country,
          city: city,
          created_at: new Date().toISOString(),
        },
      ])
      .select();
    
    if (error) {
      console.error("Error saving message:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Trigger push notification via Edge Function
    if (data && data.length > 0) {
      try {
        console.log('🔔 Sending notification for message:', data[0].id);
        
        const notificationResponse = await fetch(`${supabaseUrl}/functions/v1/send-notification`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: trimmedMessage,
            imageUrl: imageUrl,
            messageId: data[0].id,
            country: country,
            city: city
          })
        });

        if (!notificationResponse.ok) {
          const errorText = await notificationResponse.text();
          console.error('❌ Failed to send notification:', errorText);
        } else {
          const notifResult = await notificationResponse.json();
          console.log('✅ Notification sent successfully:', notifResult);
        }
      } catch (notificationError) {
        console.error('⚠️ Error sending notification:', notificationError);
        // Don't fail the main request if notification fails
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      data: data[0]
    });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" }, 
      { status: 500 }
    );
  }
}


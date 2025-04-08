import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Environment variables accessed server-side without NEXT_PUBLIC_ prefix
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Simple validation
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase environment variables are not properly configured");
}

// Create a Supabase client singleton for the API route
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: Request) {
  try {
    // Extract the message data from the request
    const { message, imageUrl } = await request.json();
    
    // Insert message into database
    const { data, error } = await supabase
      .from("anonymous_messages")
      .insert([
        {
          message: message?.trim(),
          image_url: imageUrl,
          created_at: new Date().toISOString(),
        },
      ])
      .select();
    
    if (error) {
      console.error("Error saving message:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" }, 
      { status: 500 }
    );
  }
}


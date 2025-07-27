import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Environment variables accessed server-side without NEXT_PUBLIC_ prefix
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Simple validation
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase environment variables are not properly configured");
}

// Create a Supabase client for storage operations
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Generate random filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Supabase Storage in the "anons" bucket
    const { data, error } = await supabase.storage
      .from('anons')
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return NextResponse.json({ 
        error: 'Upload failed: ' + error.message 
      }, { status: 500 });
    }

    // Get the public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from('anons')
      .getPublicUrl(fileName);

    return NextResponse.json({ 
      success: true, 
      url: urlData.publicUrl 
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: 'Upload failed' 
    }, { status: 500 });
  }
}


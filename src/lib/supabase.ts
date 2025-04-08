import { createClient } from '@supabase/supabase-js';

// These environment variables need to be updated in .env.local to include NEXT_PUBLIC_ prefix
// for client-side access

// For client-side usage
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

// Error handling for missing environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  // In development, provide a helpful error message
  if (process.env.NODE_ENV !== 'production') {
    console.error(
      '🔴 Supabase credentials missing. Please make sure you have NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
    );
    
    // For development, output which variables are missing specifically
    if (!supabaseUrl) console.error('Missing NEXT_PUBLIC_SUPABASE_URL');
    if (!supabaseAnonKey) console.error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
}

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Create the Supabase client
const supabase = createClient(
  supabaseUrl || '',  // Fallback to empty string if undefined
  supabaseAnonKey || '', // Fallback to empty string if undefined
  {
    auth: {
      persistSession: isBrowser, // Only persist sessions in browser contexts
      // You can add more auth options here if needed
    },
  }
);

export default supabase;


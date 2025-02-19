
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Initialize the Supabase client
export const supabase = createClient<Database>(
  "https://zrsceethsxgglhsrmdki.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpyc2NlZXRoc3hnZ2xoc3JtZGtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1MTU2NDYsImV4cCI6MjA1NDA5MTY0Nn0.LrUM4xuEL49XJOEkeuVRJUD_c78UugOzrRKZEQ_ZyjA",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

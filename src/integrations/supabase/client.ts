import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zrsceethsxgglhsrmdki.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpyc2NlZXRoc3hnZ2xoc3JtZGtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1MTU2NDYsImV4cCI6MjA1NDA5MTY0Nn0.LrUM4xuEL49XJOEkeuVRJUD_c78UugOzrRKZEQ_ZyjA";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
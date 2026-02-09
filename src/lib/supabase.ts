import { createClient } from '@supabase/supabase-js';

const isMock = import.meta.env.VITE_MOCK_MODE === '1';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || (isMock ? 'https://mock.supabase.co' : '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || (isMock ? 'mock-anon-key' : '');

if (!isMock && (!supabaseUrl || !supabaseAnonKey)) {
  throw new Error('Missing Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Adding the type :SupabaseClient is what clears the red lines in other files
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
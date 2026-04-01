import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Only create the client when both vars are present — otherwise returns null
// so the app can run with mock data when Supabase is not yet configured.
export const supabase: SupabaseClient | null =
  url && key ? createClient(url, key) : null;

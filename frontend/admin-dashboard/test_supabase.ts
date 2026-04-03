import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: 'c:/Users/Dell/Documents/GitHub/proptech-ai/frontend/admin-dashboard/.env' });

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!);

async function run() {
  const [res3, res4] = await Promise.all([
    supabase.from('appointments').select('id').eq('status', 'pending'),
    supabase.from('users').select('id')
  ]);

  console.log('Appointments (pending):', JSON.stringify(res3));
  console.log('Users:', JSON.stringify(res4));
}

run();

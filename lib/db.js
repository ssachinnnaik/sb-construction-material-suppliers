import { createClient } from '@supabase/supabase-js';

let _supabase = null;

function getSupabase() {
  if (_supabase) return _supabase;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }
  _supabase = createClient(supabaseUrl, supabaseKey);
  return _supabase;
}

// Lazy proxy so existing `supabase.from(...)` calls work unchanged
const supabase = new Proxy({}, {
  get(_target, prop) {
    return getSupabase()[prop];
  },
});

export default supabase;

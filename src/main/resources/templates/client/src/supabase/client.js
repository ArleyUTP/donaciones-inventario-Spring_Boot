import { createClient } from '@supabase/supabase-js';
export const client =createClient(
    process.env.REACT_APP_SUPABASE_UR,
    process.env.REACT_APP_SUPABASE_ANON_KEY
);
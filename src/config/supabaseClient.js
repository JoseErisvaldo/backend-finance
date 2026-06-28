import { createClient } from "@supabase/supabase-js";
import ws from "ws";

const options = {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  realtime: { transport: ws },
};

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  options,
);

const supabaseAuth = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  options,
);

export { supabase, supabaseAuth };

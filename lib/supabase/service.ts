import { createClient } from "@supabase/supabase-js";

import { assertSupabaseEnv } from "@/lib/env";

export function createSupabaseServiceClient() {
  assertSupabaseEnv();

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}

import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://npqlezqjyxujysehxfha.supabase.co";

export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wcWxlenFqeXh1anlzZWh4ZmhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwOTI2ODUsImV4cCI6MjEwNTY2ODY4NX0.7caYgmJ4qoBkqrOSXGIiZOb1kI11g6NOlBSZSaYVa-w";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

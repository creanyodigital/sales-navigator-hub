import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_HUB_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_HUB_ANON_KEY as string | undefined;

if (!url || !anon) {
  // eslint-disable-next-line no-console
  console.warn(
    "[supabaseHub] Missing VITE_SUPABASE_HUB_URL / VITE_SUPABASE_HUB_ANON_KEY. Hub queries will be stubbed.",
  );
}

export const supabaseHub = createClient(url ?? "https://invalid.local", anon ?? "anon", {
  auth: { persistSession: false, autoRefreshToken: false },
});

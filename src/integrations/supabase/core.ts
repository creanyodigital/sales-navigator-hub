import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_CORE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_CORE_ANON_KEY as string | undefined;

if (!url || !anon) {
  // Avoid hard-crash during initial dev when env not yet set.
  // eslint-disable-next-line no-console
  console.warn(
    "[supabaseCore] Missing VITE_SUPABASE_CORE_URL / VITE_SUPABASE_CORE_ANON_KEY. Login will fail until configured.",
  );
}

export const supabaseCore = createClient(url ?? "https://invalid.local", anon ?? "anon", {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: "sales-portal-core-auth",
  },
});

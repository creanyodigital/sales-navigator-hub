import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabaseCore } from "@/integrations/supabase/core";
import type { AppRole, CoreClient, CoreUser, ServiceMode } from "@/integrations/supabase/types";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: CoreUser | null;
  client: CoreClient | null;
  role: AppRole | null;
  clientId: string | null;
  clientSchema: string | null;
  serviceMode: ServiceMode | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function loadProfile(userId: string): Promise<{ profile: CoreUser | null; client: CoreClient | null }> {
  const { data: profile, error } = await supabaseCore
    .from("users")
    .select("id, email, full_name, role, client_id")
    .eq("id", userId)
    .maybeSingle<CoreUser>();
  if (error || !profile) return { profile: null, client: null };

  let client: CoreClient | null = null;
  if (profile.client_id) {
    const { data } = await supabaseCore
      .from("clients")
      .select("id, name, schema_name, service_mode, is_active")
      .eq("id", profile.client_id)
      .maybeSingle<CoreClient>();
    client = data ?? null;
  }
  return { profile, client };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<CoreUser | null>(null);
  const [client, setClient] = useState<CoreClient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const { data: sub } = supabaseCore.auth.onAuthStateChange((_event, newSession) => {
      if (!mounted) return;
      setSession(newSession);
      if (newSession?.user) {
        // Defer profile fetch to avoid deadlocking the auth callback
        setTimeout(async () => {
          const { profile, client } = await loadProfile(newSession.user.id);
          if (!mounted) return;
          setProfile(profile);
          setClient(client);
        }, 0);
      } else {
        setProfile(null);
        setClient(null);
      }
    });

    supabaseCore.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      if (data.session?.user) {
        const { profile, client } = await loadProfile(data.session.user.id);
        if (!mounted) return;
        setProfile(profile);
        setClient(client);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signIn: AuthContextValue["signIn"] = async (email, password) => {
    const { error } = await supabaseCore.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signOut = async () => {
    await supabaseCore.auth.signOut();
    setProfile(null);
    setClient(null);
  };

  const value: AuthContextValue = {
    user: session?.user ?? null,
    session,
    profile,
    client,
    role: profile?.role ?? null,
    clientId: profile?.client_id ?? null,
    clientSchema: client?.schema_name ?? null,
    serviceMode: client?.service_mode ?? null,
    loading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

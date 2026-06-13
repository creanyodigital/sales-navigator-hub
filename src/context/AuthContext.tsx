import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabaseCore } from "@/integrations/supabase/core";
import type { AppRole, CoreClient, CoreUser, ServiceMode } from "@/types/portal";
import { mockClients } from "@/lib/mocks/clients";

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
  isMock: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signInMock: (role: AppRole) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function buildMockUser(id: string, email: string, fullName: string): User {
  return {
    id,
    email,
    user_metadata: { full_name: fullName },
    app_metadata: {},
    aud: "authenticated",
    created_at: new Date().toISOString(),
    confirmed_at: new Date().toISOString(),
    last_sign_in_at: new Date().toISOString(),
    role: "authenticated",
    updated_at: new Date().toISOString(),
  } as unknown as User;
}

function buildMockSession(user: User): Session {
  const now = Math.floor(Date.now() / 1000);
  return {
    access_token: "mock-access-token",
    refresh_token: "mock-refresh-token",
    expires_in: 3600,
    expires_at: now + 3600,
    token_type: "bearer",
    user,
  } as unknown as Session;
}

function getMockProfile(role: AppRole): CoreUser {
  const profiles: Record<AppRole, CoreUser> = {
    admin: {
      id: "mock-admin",
      email: "admin@demo.com",
      full_name: "Administrador Demo",
      role: "admin",
      client_id: null,
    },
    staff: {
      id: "mock-staff",
      email: "staff@demo.com",
      full_name: "Operario Demo",
      role: "staff",
      client_id: null,
    },
    client: {
      id: "mock-client",
      email: "client@demo.com",
      full_name: "Cliente Demo",
      role: "client",
      client_id: "c-001",
    },
  };
  return profiles[role];
}

function getMockClient(clientId: string | null): CoreClient | null {
  if (!clientId) return null;
  return mockClients.find((c) => c.id === clientId) ?? null;
}

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

const MOCK_STORAGE_KEY = "sales-portal-mock-role";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<CoreUser | null>(null);
  const [client, setClient] = useState<CoreClient | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock] = useState(false);

  useEffect(() => {
    // Check if there's a saved mock role in localStorage
    const savedMockRole = localStorage.getItem(MOCK_STORAGE_KEY) as AppRole | null;
    if (savedMockRole) {
      activateMock(savedMockRole);
      setLoading(false);
      return;
    }

    let mounted = true;

    const { data: sub } = supabaseCore.auth.onAuthStateChange((_event, newSession) => {
      if (!mounted) return;
      setSession(newSession);
      setIsMock(false);
      if (newSession?.user) {
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

  function activateMock(role: AppRole) {
    const mockProfile = getMockProfile(role);
    const mockClient = getMockClient(mockProfile.client_id);
    const mockUser = buildMockUser(mockProfile.id, mockProfile.email, mockProfile.full_name ?? "");
    const mockSession = buildMockSession(mockUser);
    setSession(mockSession);
    setProfile(mockProfile);
    setClient(mockClient);
    setIsMock(true);
    setLoading(false);
  }

  const signIn: AuthContextValue["signIn"] = async (email, password) => {
    const { error } = await supabaseCore.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signInMock: AuthContextValue["signInMock"] = (role) => {
    localStorage.setItem(MOCK_STORAGE_KEY, role);
    activateMock(role);
  };

  const signOut = async () => {
    localStorage.removeItem(MOCK_STORAGE_KEY);
    await supabaseCore.auth.signOut();
    setSession(null);
    setProfile(null);
    setClient(null);
    setIsMock(false);
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
    isMock,
    signIn,
    signInMock,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

import { createFileRoute, Navigate, Outlet, useRouterState } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { useAuth } from "@/context/AuthContext";
import { OperationsProvider } from "@/context/OperationsContext";
import type { AppRole } from "@/integrations/supabase/types";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

// Route -> allowed roles
const routeAccess: { prefix: string; roles: AppRole[]; requiresSelfManaged?: boolean }[] = [
  { prefix: "/dashboard", roles: ["client"] },
  { prefix: "/prospects", roles: ["client"] },
  { prefix: "/calendar", roles: ["client"] },
  { prefix: "/reports", roles: ["client"] },
  { prefix: "/hitl-client", roles: ["client"], requiresSelfManaged: true },
  { prefix: "/hitl", roles: ["admin", "staff"] },
  { prefix: "/prospecting", roles: ["admin", "staff"] },
  { prefix: "/clients", roles: ["admin"] },
];

function AppLayout() {
  const { loading, session, role, serviceMode } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Cargando sesión…
      </div>
    );
  }
  if (!session) return <Navigate to="/login" />;
  if (!role) return <Navigate to="/forbidden" />;

  const match = routeAccess.find((r) => pathname === r.prefix || pathname.startsWith(r.prefix + "/"));
  if (match) {
    if (!match.roles.includes(role)) return <Navigate to="/forbidden" />;
    if (match.requiresSelfManaged && serviceMode !== "self_managed") return <Navigate to="/forbidden" />;
  }

  return (
    <OperationsProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <SidebarInset className="flex flex-1 flex-col">
            <AppNavbar />
            <main className="flex-1 p-4 md:p-6">
              <Outlet />
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </OperationsProvider>
  );
}

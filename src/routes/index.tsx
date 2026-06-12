import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/")({
  component: IndexRedirect,
});

function IndexRedirect() {
  const { loading, session, role } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Cargando…
      </div>
    );
  }
  if (!session) return <Navigate to="/login" />;
  if (role === "client") return <Navigate to="/dashboard" />;
  if (role === "admin" || role === "staff") return <Navigate to="/hitl" />;
  return <Navigate to="/forbidden" />;
}

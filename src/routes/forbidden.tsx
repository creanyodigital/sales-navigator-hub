import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/forbidden")({
  component: ForbiddenPage,
});

function ForbiddenPage() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--brand-orange)]/15 text-[var(--brand-orange)]">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-5xl font-bold tracking-tight">403</h1>
        <h2 className="mt-2 text-xl font-semibold">Acceso restringido</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          No tienes permisos para acceder a esta sección. Si crees que es un error,
          contacta al administrador del Sales Portal.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button variant="outline" onClick={() => navigate({ to: "/" })}>
            Volver al inicio
          </Button>
          <Button
            onClick={async () => {
              await signOut();
              navigate({ to: "/login" });
            }}
          >
            Cerrar sesión
          </Button>
        </div>
      </div>
    </div>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import type { AppRole } from "@/types/portal";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

const demoRoles: { label: string; role: AppRole; color: string }[] = [
  { label: "Demo Administrador", role: "admin", color: "bg-[var(--brand-purple)]" },
  { label: "Demo Staff", role: "staff", color: "bg-[var(--brand-orange)]" },
  { label: "Demo Cliente", role: "client", color: "bg-[var(--brand-pink)]" },
];

function LoginPage() {
  const { signIn, signInMock } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      toast.error("No se pudo iniciar sesión", { description: error });
      return;
    }
    toast.success("Sesión iniciada");
    navigate({ to: "/" });
  };

  const onDemo = (role: AppRole) => {
    signInMock(role);
    toast.success(`Modo demo: ${role}`);
    navigate({ to: "/" });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-[var(--brand-purple)] opacity-20 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[var(--brand-orange)] opacity-15 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--brand-pink)] opacity-10 blur-3xl" />
      </div>

      <Card className="w-full max-w-md border-border/50 shadow-xl">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--brand-purple)] text-lg font-bold text-white">
            S
          </div>
          <CardTitle className="text-2xl">Sales Portal</CardTitle>
          <CardDescription>Inicia sesión para acceder al portal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Ingresando…" : "Ingresar"}
            </Button>
            <p className="pt-2 text-center text-xs text-muted-foreground">
              La autenticación se realiza contra Supabase Core.
            </p>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">O prueba el portal</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {demoRoles.map(({ label, role, color }) => (
              <Button
                key={role}
                type="button"
                variant="outline"
                className={`h-auto flex-col gap-1 border-0 py-3 text-xs font-medium text-white hover:opacity-90 ${color}`}
                onClick={() => onDemo(role)}
              >
                <span className="font-semibold">{label.split(" ")[1]}</span>
                <span className="opacity-80">{label.split(" ")[0]}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

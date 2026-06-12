import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/_app/hitl-client")({
  component: HitlClientPage,
});

function HitlClientPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Revisión HITL</h1>
        <p className="text-sm text-muted-foreground">
          Aprueba o ajusta los mensajes propuestos por la IA antes de su envío.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldCheck className="h-4 w-4 text-[var(--brand-purple)]" />
            Modo self-managed
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Esta vista te permite intervenir manualmente en los mensajes salientes.
          Próximamente: cola completa, edición inline y métricas de calidad.
        </CardContent>
      </Card>
    </div>
  );
}

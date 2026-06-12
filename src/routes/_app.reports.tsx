import { createFileRoute } from "@tanstack/react-router";
import { Download, FileBarChart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_app/reports")({
  component: ReportsPage,
});

function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reportes</h1>
        <p className="text-sm text-muted-foreground">
          Descarga reportes consolidados del trabajo realizado.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[
          { title: "Reporte mensual de campañas", desc: "Envíos, aperturas, respuestas y reuniones." },
          { title: "Reporte de prospección", desc: "Base completa con estados y últimas interacciones." },
          { title: "Reporte de reuniones", desc: "Reuniones agendadas y resultados del periodo." },
          { title: "Reporte ejecutivo", desc: "Resumen ejecutivo de alto nivel para stakeholders." },
        ].map((r) => (
          <Card key={r.title}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--brand-purple)]/10 text-[var(--brand-purple)]">
                  <FileBarChart className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base">{r.title}</CardTitle>
                  <CardDescription>{r.desc}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => toast.success("Generando reporte…", { description: r.title })}
                className="w-full sm:w-auto"
              >
                <Download className="mr-2 h-4 w-4" />
                Generar PDF
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

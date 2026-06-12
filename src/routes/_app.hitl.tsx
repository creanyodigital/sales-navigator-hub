import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, Edit3, X } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useOperations } from "@/context/OperationsContext";
import { mockHitl } from "@/lib/mocks/hitl";

export const Route = createFileRoute("/_app/hitl")({
  component: HitlPage,
});

function HitlPage() {
  const { selectedClient } = useOperations();
  // TODO(hub): supabaseHub.from(`${selectedClient.schema_name}.hitl_queue`).select(...)
  const items = useMemo(() => mockHitl.filter((h) => h.clientId === selectedClient.id), [selectedClient]);
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);
  const active = items.find((i) => i.id === activeId) ?? items[0] ?? null;

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Bandeja HITL Operativa</h1>
          <p className="text-sm text-muted-foreground">
            Revisión humana de leads para {selectedClient.name}{" "}
            <span className="font-mono text-xs">({selectedClient.schema_name})</span>
          </p>
        </div>
        <Badge variant="secondary">{items.length} pendientes</Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <Card className="overflow-hidden">
          <CardHeader className="border-b py-3">
            <CardTitle className="text-sm">Cola</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {items.length === 0 && (
              <div className="p-6 text-sm text-muted-foreground">Sin items pendientes para este cliente.</div>
            )}
            {items.map((i) => (
              <button
                key={i.id}
                onClick={() => setActiveId(i.id)}
                className={`flex w-full flex-col items-start gap-1 border-b px-4 py-3 text-left text-sm transition-colors last:border-0 hover:bg-muted ${
                  activeId === i.id ? "bg-muted" : ""
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="font-medium">{i.leadName}</span>
                  <span className="text-[10px] text-muted-foreground">{i.createdAt}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {i.leadRole} · {i.leadCompany}
                </span>
                <span className="line-clamp-1 text-xs text-muted-foreground">{i.subject}</span>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card>
          {active ? (
            <>
              <CardHeader className="border-b">
                <div className="flex flex-col gap-1">
                  <CardTitle className="text-base">{active.subject}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Para: <span className="font-medium">{active.leadName}</span> ({active.leadCompany})
                  </p>
                  <Badge variant="secondary" className="mt-1 w-fit text-[var(--brand-orange)]">
                    {active.reason}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <Textarea
                  defaultValue={active.proposedBody}
                  className="min-h-[280px] font-mono text-sm"
                />
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => toast.success("Lead aprobado y enviado")}>
                    <Check className="mr-2 h-4 w-4" />
                    Aprobar y enviar
                  </Button>
                  <Button variant="outline" onClick={() => toast.info("Cambios guardados")}>
                    <Edit3 className="mr-2 h-4 w-4" />
                    Guardar edición
                  </Button>
                  <Button variant="destructive" onClick={() => toast.error("Lead rechazado")}>
                    <X className="mr-2 h-4 w-4" />
                    Rechazar
                  </Button>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex h-80 items-center justify-center text-sm text-muted-foreground">
              Selecciona un item de la cola.
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}

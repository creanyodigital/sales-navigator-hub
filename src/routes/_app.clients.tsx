import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockClients } from "@/lib/mocks/clients";
import type { CoreClient, ServiceMode } from "@/types/portal";

export const Route = createFileRoute("/_app/clients")({
  component: ClientsPage,
});

function ClientsPage() {
  const [clients, setClients] = useState<CoreClient[]>(mockClients);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<{ name: string; schema_name: string; service_mode: ServiceMode }>(
    { name: "", schema_name: "", service_mode: "full_service" },
  );

  const toggleActive = (id: string) =>
    setClients((cs) => cs.map((c) => (c.id === id ? { ...c, is_active: !c.is_active } : c)));
  const toggleMode = (id: string) =>
    setClients((cs) =>
      cs.map((c) =>
        c.id === id
          ? { ...c, service_mode: c.service_mode === "full_service" ? "self_managed" : "full_service" }
          : c,
      ),
    );

  const create = () => {
    if (!draft.name || !draft.schema_name) {
      toast.error("Nombre y schema son obligatorios");
      return;
    }
    setClients((cs) => [
      ...cs,
      { id: `c-${Date.now()}`, name: draft.name, schema_name: draft.schema_name, service_mode: draft.service_mode, is_active: true },
    ]);
    setDraft({ name: "", schema_name: "", service_mode: "full_service" });
    setOpen(false);
    toast.success("Cliente creado (mock)");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Control de Clientes</h1>
          <p className="text-sm text-muted-foreground">
            Activa nuevos clientes, define su esquema en Hub y alterna su modo de servicio.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo cliente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Activar cliente</DialogTitle>
              <DialogDescription>
                Se creará el registro en Core y se asociará a un schema en Hub.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Schema (Hub)</Label>
                <Input
                  placeholder="client_nuevo"
                  value={draft.schema_name}
                  onChange={(e) => setDraft({ ...draft, schema_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Modo de servicio</Label>
                <Select
                  value={draft.service_mode}
                  onValueChange={(v: ServiceMode) => setDraft({ ...draft, service_mode: v })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full_service">Full service</SelectItem>
                    <SelectItem value="self_managed">Self-managed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button onClick={create}>Crear</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{clients.length} clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Schema</TableHead>
                  <TableHead>Modo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Activo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{c.schema_name}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => toggleMode(c.id)}
                        className="inline-flex"
                        aria-label="Cambiar modo"
                      >
                        <Badge
                          variant="secondary"
                          className={
                            c.service_mode === "full_service"
                              ? "bg-[var(--brand-purple)]/15 text-[var(--brand-purple)]"
                              : "bg-[var(--brand-orange)]/15 text-[var(--brand-orange)]"
                          }
                        >
                          {c.service_mode === "full_service" ? "Full service" : "Self-managed"}
                        </Badge>
                      </button>
                    </TableCell>
                    <TableCell>
                      <Badge variant={c.is_active ? "default" : "secondary"}>
                        {c.is_active ? "Activo" : "Pausado"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Switch checked={c.is_active} onCheckedChange={() => toggleActive(c.id)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

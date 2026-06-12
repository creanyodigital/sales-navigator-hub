import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockProspects, type ProspectStatus } from "@/lib/mocks/prospects";

export const Route = createFileRoute("/_app/prospects")({
  component: ProspectsPage,
});

const statusColor: Record<ProspectStatus, string> = {
  Nuevo: "bg-muted text-foreground",
  Contactado: "bg-[var(--brand-purple)]/15 text-[var(--brand-purple)]",
  "Respondió": "bg-[var(--brand-orange)]/15 text-[var(--brand-orange)]",
  "Reunión": "bg-[var(--brand-pink)]/20 text-[var(--brand-pink)]",
  "No interesado": "bg-destructive/15 text-destructive",
};

function ProspectsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [sector, setSector] = useState<string>("all");

  const sectors = useMemo(() => Array.from(new Set(mockProspects.map((p) => p.sector))), []);
  const statuses = useMemo(() => Array.from(new Set(mockProspects.map((p) => p.status))), []);

  const filtered = mockProspects.filter((p) => {
    const matchText =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.company.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status === "all" || p.status === status;
    const matchSector = sector === "all" || p.sector === sector;
    return matchText && matchStatus && matchSector;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Base de Prospectos</h1>
        <p className="text-sm text-muted-foreground">
          Contactos y empresas prospectadas para tu cuenta.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-base">{filtered.length} prospectos</CardTitle>
          <div className="flex flex-col gap-2 md:flex-row">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 md:w-64"
              />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="md:w-44"><SelectValue placeholder="Estado" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                {statuses.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sector} onValueChange={setSector}>
              <SelectTrigger className="md:w-44"><SelectValue placeholder="Sector" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los sectores</SelectItem>
                {sectors.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Última interacción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>{p.company}</TableCell>
                    <TableCell>{p.role}</TableCell>
                    <TableCell className="text-muted-foreground">{p.email}</TableCell>
                    <TableCell>{p.sector}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={statusColor[p.status]}>
                        {p.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">{p.lastInteraction}</TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-sm text-muted-foreground">
                      Sin resultados con los filtros actuales.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

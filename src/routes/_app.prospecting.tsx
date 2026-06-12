import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOperations } from "@/context/OperationsContext";

export const Route = createFileRoute("/_app/prospecting")({
  component: ProspectingPage,
});

const schema = z.object({
  segment: z.string().min(2, "Requerido"),
  icp: z.string().min(10, "Describe el ICP con más detalle"),
  tone: z.string().min(1),
  dailyVolume: z.coerce.number().min(10).max(5000),
  channel: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

function ProspectingPage() {
  const { selectedClient } = useOperations();
  const { register, handleSubmit, setValue, watch, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { tone: "consultivo", channel: "email", dailyVolume: 200, segment: "", icp: "" },
  });

  const onSubmit = (values: FormValues) => {
    // TODO(hub): persist to supabaseHub schema `${selectedClient.schema_name}.campaign_config`
    toast.success("Configuración guardada (mock)", {
      description: `${selectedClient.name} · ${values.dailyVolume}/día`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Módulo de Prospección</h1>
        <p className="text-sm text-muted-foreground">
          Variables de inyección para campañas automáticas — {selectedClient.name}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Configuración de campaña</CardTitle>
          <CardDescription>
            Estas variables alimentan al motor de generación de copy.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="segment">Segmento</Label>
              <Input id="segment" placeholder="SaaS B2B Latam" {...register("segment")} />
              {formState.errors.segment && (
                <p className="text-xs text-destructive">{formState.errors.segment.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dailyVolume">Volumen diario</Label>
              <Input id="dailyVolume" type="number" {...register("dailyVolume")} />
              {formState.errors.dailyVolume && (
                <p className="text-xs text-destructive">{formState.errors.dailyVolume.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Tono</Label>
              <Select value={watch("tone")} onValueChange={(v) => setValue("tone", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultivo">Consultivo</SelectItem>
                  <SelectItem value="directo">Directo</SelectItem>
                  <SelectItem value="cercano">Cercano</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Canal</Label>
              <Select value={watch("channel")} onValueChange={(v) => setValue("channel", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="multi">Multicanal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="icp">Descripción del ICP</Label>
              <Textarea
                id="icp"
                rows={5}
                placeholder="Cargo, industria, tamaño de empresa, señales de intención…"
                {...register("icp")}
              />
              {formState.errors.icp && (
                <p className="text-xs text-destructive">{formState.errors.icp.message}</p>
              )}
            </div>

            <div className="md:col-span-2 flex justify-end">
              <Button type="submit">Guardar borrador</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

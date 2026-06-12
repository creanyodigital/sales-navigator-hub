import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mailAccounts, mockEvents, type CalendarEvent } from "@/lib/mocks/calendar";

export const Route = createFileRoute("/_app/calendar")({
  component: CalendarPage,
});

function CalendarPage() {
  const [current, setCurrent] = useState(new Date());
  const [selected, setSelected] = useState<CalendarEvent | null>(null);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(current), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(current), { weekStartsOn: 1 });
    const arr: Date[] = [];
    let d = start;
    while (d <= end) {
      arr.push(d);
      d = new Date(d.getTime() + 24 * 60 * 60 * 1000);
    }
    return arr;
  }, [current]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const e of mockEvents) {
      const arr = map.get(e.date) ?? [];
      arr.push(e);
      map.set(e.date, arr);
    }
    return map;
  }, []);

  const today = new Date();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Calendario Unificado</h1>
          <p className="text-sm text-muted-foreground">
            Reuniones consolidadas de tus cuentas de correo.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {mailAccounts.map((a) => (
            <div key={a.id} className="flex items-center gap-2 text-xs">
              <span className={`h-2.5 w-2.5 rounded-full ${a.color}`} />
              <span className="text-muted-foreground">{a.email}</span>
            </div>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setCurrent(subMonths(current, 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setCurrent(addMonths(current, 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setCurrent(new Date())}>
                Hoy
              </Button>
            </div>
            <h2 className="text-lg font-semibold capitalize">
              {format(current, "MMMM yyyy", { locale: es })}
            </h2>
          </div>

          <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border bg-border">
            {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => (
              <div key={d} className="bg-muted/50 p-2 text-center text-xs font-medium text-muted-foreground">
                {d}
              </div>
            ))}
            {days.map((day) => {
              const key = format(day, "yyyy-MM-dd");
              const events = eventsByDay.get(key) ?? [];
              const muted = !isSameMonth(day, current);
              const isToday = isSameDay(day, today);
              return (
                <div
                  key={key}
                  className={`min-h-[110px] bg-background p-2 ${muted ? "opacity-40" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                        isToday ? "bg-[var(--brand-purple)] font-semibold text-white" : "text-foreground"
                      }`}
                    >
                      {format(day, "d")}
                    </span>
                  </div>
                  <div className="mt-1 space-y-1">
                    {events.map((e) => {
                      const acc = mailAccounts.find((a) => a.id === e.accountId)!;
                      return (
                        <button
                          key={e.id}
                          onClick={() => setSelected(e)}
                          className="flex w-full items-center gap-1 truncate rounded-md border border-transparent bg-muted/60 px-1.5 py-1 text-left text-[11px] hover:border-border hover:bg-muted"
                        >
                          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${acc.color}`} />
                          <span className="font-medium">{e.hour}</span>
                          <span className="truncate text-muted-foreground">{e.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full p-0 sm:max-w-md">
          {selected && (
            <>
              <SheetHeader className="border-b p-6">
                <SheetTitle>Dossier del Lead</SheetTitle>
                <SheetDescription>{selected.title}</SheetDescription>
              </SheetHeader>
              <div className="space-y-6 p-6">
                <div>
                  <div className="text-lg font-semibold">{selected.leadName}</div>
                  <div className="text-sm text-muted-foreground">
                    {selected.leadRole} · {selected.leadCompany}
                  </div>
                  <Badge className="mt-2" variant="secondary">
                    {format(new Date(selected.date), "d MMM yyyy", { locale: es })} · {selected.hour}
                  </Badge>
                </div>

                <Tabs defaultValue="summary">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="summary">Resumen IA</TabsTrigger>
                    <TabsTrigger value="history">Historial</TabsTrigger>
                  </TabsList>
                  <TabsContent value="summary" className="pt-4">
                    <div className="rounded-lg border bg-muted/40 p-4 text-sm leading-relaxed">
                      {selected.summary}
                    </div>
                  </TabsContent>
                  <TabsContent value="history" className="pt-4">
                    <ul className="space-y-3">
                      {selected.history.map((h, i) => (
                        <li key={i} className="flex gap-3">
                          <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--brand-purple)]" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{h.type}</span>
                              <span className="text-xs text-muted-foreground">{h.date}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{h.text}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </TabsContent>
                </Tabs>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

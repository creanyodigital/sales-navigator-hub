export interface AppNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
}

export const mockNotifications: AppNotification[] = [
  { id: "n1", title: "Nueva reunión agendada", description: "Ana García (Acme) — mañana 10:00", time: "hace 5 min", unread: true },
  { id: "n2", title: "Lead requiere revisión", description: "Mateo Torres — bandeja HITL", time: "hace 38 min", unread: true },
  { id: "n3", title: "Campaña completada", description: "Secuencia Q2 — 2.140 envíos", time: "hace 3 h", unread: false },
  { id: "n4", title: "Nuevo cliente activado", description: "Initech — schema client_initech", time: "ayer", unread: false },
];

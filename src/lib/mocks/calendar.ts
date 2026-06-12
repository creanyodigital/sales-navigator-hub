export interface MailAccount {
  id: string;
  email: string;
  color: string; // tailwind bg-* token via brand
}

export const mailAccounts: MailAccount[] = [
  { id: "a1", email: "ventas@empresa.com", color: "bg-[hsl(var(--brand-purple))]" },
  { id: "a2", email: "outreach@empresa.com", color: "bg-[hsl(var(--brand-orange))]" },
  { id: "a3", email: "ceo@empresa.com", color: "bg-[hsl(var(--brand-pink))]" },
];

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  hour: string;
  title: string;
  accountId: string;
  leadName: string;
  leadCompany: string;
  leadRole: string;
  summary: string;
  history: { date: string; type: string; text: string }[];
}

const today = new Date();
const y = today.getFullYear();
const m = today.getMonth();
const fmt = (d: number) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

export const mockEvents: CalendarEvent[] = [
  {
    id: "e1", date: fmt(3), hour: "10:00", title: "Discovery call · Acme",
    accountId: "a1", leadName: "Ana García", leadCompany: "Acme", leadRole: "CMO",
    summary: "Lead respondió interesado tras 2do follow-up. Busca solución para outbound automatizado.",
    history: [
      { date: "Hace 5 días", type: "Envío", text: "Email inicial enviado." },
      { date: "Hace 3 días", type: "Apertura", text: "Abrió el email 4 veces." },
      { date: "Hace 1 día", type: "Respuesta", text: "Pidió agendar una demo." },
    ],
  },
  {
    id: "e2", date: fmt(7), hour: "15:30", title: "Demo · Northwind",
    accountId: "a2", leadName: "Carlos Pérez", leadCompany: "Northwind", leadRole: "Head of Sales",
    summary: "Evalúa reemplazar herramienta actual. Decisor confirmado.",
    history: [
      { date: "Hace 7 días", type: "Envío", text: "Primer contacto." },
      { date: "Hace 2 días", type: "Respuesta", text: "Solicitó propuesta." },
    ],
  },
  {
    id: "e3", date: fmt(12), hour: "09:00", title: "Follow-up · Globex",
    accountId: "a3", leadName: "Sofía López", leadCompany: "Globex", leadRole: "CEO",
    summary: "Reunión de seguimiento sobre propuesta enviada.",
    history: [{ date: "Hace 10 días", type: "Reunión", text: "Discovery completada." }],
  },
  {
    id: "e4", date: fmt(15), hour: "11:00", title: "Discovery · Initech",
    accountId: "a1", leadName: "Mateo Torres", leadCompany: "Initech", leadRole: "VP Marketing",
    summary: "Interés en pricing enterprise.",
    history: [{ date: "Hace 4 días", type: "Apertura", text: "Abrió el email 2 veces." }],
  },
  {
    id: "e5", date: fmt(18), hour: "16:00", title: "Cierre · Umbrella",
    accountId: "a2", leadName: "Valeria Ramírez", leadCompany: "Umbrella", leadRole: "Director Comercial",
    summary: "Reunión de cierre — contrato listo para firma.",
    history: [{ date: "Hace 14 días", type: "Reunión", text: "Discovery." }, { date: "Hace 5 días", type: "Reunión", text: "Demo técnica." }],
  },
  {
    id: "e6", date: fmt(22), hour: "14:00", title: "Demo · Stark Industries",
    accountId: "a3", leadName: "Diego Vega", leadCompany: "Stark", leadRole: "CMO",
    summary: "Demo agendada por respuesta positiva a secuencia 2.",
    history: [{ date: "Hace 6 días", type: "Respuesta", text: "Confirmó interés." }],
  },
];

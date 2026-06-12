export interface HitlItem {
  id: string;
  clientId: string;
  leadName: string;
  leadCompany: string;
  leadRole: string;
  subject: string;
  proposedBody: string;
  reason: string;
  createdAt: string;
}

export const mockHitl: HitlItem[] = [
  {
    id: "h-001", clientId: "c-001",
    leadName: "Ana García", leadCompany: "Acme", leadRole: "CMO",
    subject: "Re: Propuesta de outbound para Acme",
    proposedBody:
      "Hola Ana,\n\nGracias por tu respuesta. Adjunto la propuesta que mencionamos, ajustada al volumen mensual que conversamos (~2.000 contactos / mes).\n\n¿Tienes 20 minutos esta semana para revisarla juntos?\n\nSaludos,",
    reason: "Cliente de alto valor — requiere revisión humana antes de envío.",
    createdAt: "Hace 12 min",
  },
  {
    id: "h-002", clientId: "c-001",
    leadName: "Mateo Torres", leadCompany: "Initech", leadRole: "VP Marketing",
    subject: "Idea para tu programa de adquisición Q2",
    proposedBody:
      "Hola Mateo,\n\nVi tu charla en SaaStr y se me ocurrió una forma de aplicar lo que mostraste al programa que vienen escalando…",
    reason: "Email contiene afirmación específica (charla) — verificar exactitud.",
    createdAt: "Hace 38 min",
  },
  {
    id: "h-003", clientId: "c-002",
    leadName: "Sofía López", leadCompany: "Globex", leadRole: "CEO",
    subject: "Follow-up final · Globex",
    proposedBody:
      "Hola Sofía,\n\nÚltimo intento de mi parte. Si no es el momento, sin problema — solo quería cerrar el loop.\n\nGracias por el tiempo.",
    reason: "Último follow-up de la secuencia — confirma tono.",
    createdAt: "Hace 2 h",
  },
];

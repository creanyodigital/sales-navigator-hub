export type ProspectStatus = "Nuevo" | "Contactado" | "Respondió" | "Reunión" | "No interesado";

export interface Prospect {
  id: string;
  name: string;
  company: string;
  role: string;
  email: string;
  sector: string;
  status: ProspectStatus;
  lastInteraction: string;
}

const sectors = ["SaaS", "Fintech", "Retail", "Salud", "Industria", "Educación"];
const statuses: ProspectStatus[] = ["Nuevo", "Contactado", "Respondió", "Reunión", "No interesado"];
const firstNames = ["Ana", "Carlos", "Lucía", "Marcos", "Sofía", "Diego", "Valeria", "Mateo", "Camila", "Andrés"];
const lastNames = ["García", "Pérez", "López", "Martínez", "Ramírez", "Torres", "Vega", "Sosa"];
const companies = ["Acme", "Northwind", "Globex", "Initech", "Umbrella", "Soylent", "Stark", "Wayne", "Hooli", "Pied Piper"];
const roles = ["CMO", "Head of Sales", "Growth Lead", "CEO", "VP Marketing", "Director Comercial"];

export const mockProspects: Prospect[] = Array.from({ length: 36 }).map((_, i) => {
  const fn = firstNames[i % firstNames.length];
  const ln = lastNames[(i * 3) % lastNames.length];
  const co = companies[i % companies.length];
  return {
    id: `p-${1000 + i}`,
    name: `${fn} ${ln}`,
    company: co,
    role: roles[i % roles.length],
    email: `${fn.toLowerCase()}.${ln.toLowerCase()}@${co.toLowerCase()}.com`,
    sector: sectors[i % sectors.length],
    status: statuses[i % statuses.length],
    lastInteraction: `${1 + (i % 28)} días`,
  };
});

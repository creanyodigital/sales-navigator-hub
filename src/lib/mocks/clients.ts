import type { CoreClient } from "@/integrations/supabase/types";

export const mockClients: CoreClient[] = [
  { id: "c-001", name: "Acme Corp", schema_name: "client_acme", service_mode: "full_service", is_active: true },
  { id: "c-002", name: "Northwind", schema_name: "client_northwind", service_mode: "self_managed", is_active: true },
  { id: "c-003", name: "Globex", schema_name: "client_globex", service_mode: "full_service", is_active: false },
  { id: "c-004", name: "Initech", schema_name: "client_initech", service_mode: "self_managed", is_active: true },
];

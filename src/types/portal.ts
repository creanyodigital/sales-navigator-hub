export type AppRole = "admin" | "staff" | "client";
export type ServiceMode = "full_service" | "self_managed";

export interface CoreUser {
  id: string;
  email: string;
  full_name: string | null;
  role: AppRole;
  client_id: string | null;
}

export interface CoreClient {
  id: string;
  name: string;
  schema_name: string;
  service_mode: ServiceMode;
  is_active: boolean;
}

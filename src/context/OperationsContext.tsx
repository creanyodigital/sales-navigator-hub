import { createContext, useContext, useState, type ReactNode } from "react";
import { mockClients } from "@/lib/mocks/clients";
import type { CoreClient } from "@/types/portal";

interface OperationsContextValue {
  clients: CoreClient[];
  selectedClientId: string;
  setSelectedClientId: (id: string) => void;
  selectedClient: CoreClient;
}

const OperationsContext = createContext<OperationsContextValue | undefined>(undefined);

export function OperationsProvider({ children }: { children: ReactNode }) {
  const [selectedClientId, setSelectedClientId] = useState<string>(mockClients[0].id);
  const selectedClient = mockClients.find((c) => c.id === selectedClientId) ?? mockClients[0];
  return (
    <OperationsContext.Provider
      value={{ clients: mockClients, selectedClientId, setSelectedClientId, selectedClient }}
    >
      {children}
    </OperationsContext.Provider>
  );
}

export function useOperations() {
  const ctx = useContext(OperationsContext);
  if (!ctx) throw new Error("useOperations must be used within OperationsProvider");
  return ctx;
}

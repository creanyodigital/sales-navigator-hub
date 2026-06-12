import { Bell, LogOut, User as UserIcon } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { useOperations } from "@/context/OperationsContext";
import { mockNotifications } from "@/lib/mocks/notifications";

export function AppNavbar() {
  const { profile, role, signOut } = useAuth();
  const navigate = useNavigate();
  const ops = (role === "admin" || role === "staff") ? useOperations() : null;
  const unread = mockNotifications.filter((n) => n.unread).length;

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/login" });
  };

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur">
      <SidebarTrigger />
      <div className="ml-2 hidden text-sm text-muted-foreground md:block">
        Sales Portal
      </div>

      <div className="ml-auto flex items-center gap-2">
        {ops && (
          <div className="hidden items-center gap-2 md:flex">
            <span className="text-xs text-muted-foreground">Cuenta:</span>
            <Select value={ops.selectedClientId} onValueChange={ops.setSelectedClientId}>
              <SelectTrigger className="h-9 w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ops.clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}{" "}
                    <span className="ml-2 text-xs text-muted-foreground">
                      {c.service_mode === "full_service" ? "FS" : "SM"}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              {unread > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[var(--brand-orange)]" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <span className="text-sm font-semibold">Notificaciones</span>
              <Badge variant="secondary">{unread} nuevas</Badge>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {mockNotifications.map((n) => (
                <div
                  key={n.id}
                  className="flex flex-col gap-1 border-b px-4 py-3 last:border-0 hover:bg-muted/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{n.title}</span>
                    {n.unread && (
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-orange)]" />
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{n.description}</span>
                  <span className="text-[10px] text-muted-foreground">{n.time}</span>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand-purple)] text-white text-xs font-semibold">
                {(profile?.full_name ?? profile?.email ?? "?").charAt(0).toUpperCase()}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm">{profile?.full_name ?? "Usuario"}</span>
                <span className="text-xs font-normal text-muted-foreground">{profile?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
              <UserIcon className="mr-2 h-4 w-4" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

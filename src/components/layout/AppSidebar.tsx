import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileBarChart,
  Inbox,
  Settings2,
  Building2,
  ShieldCheck,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";

type Item = { title: string; url: string; icon: React.ComponentType<{ className?: string }> };

export function AppSidebar() {
  const { role, serviceMode } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (url: string) => pathname === url;

  const clientItems: Item[] = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Prospectos", url: "/prospects", icon: Users },
    { title: "Calendario", url: "/calendar", icon: Calendar },
    { title: "Reportes", url: "/reports", icon: FileBarChart },
  ];
  if (serviceMode === "self_managed") {
    clientItems.push({ title: "Mi HITL", url: "/hitl-client", icon: ShieldCheck });
  }

  const opsItems: Item[] = [
    { title: "Bandeja HITL", url: "/hitl", icon: Inbox },
    { title: "Prospección", url: "/prospecting", icon: Settings2 },
  ];
  const adminItems: Item[] = [{ title: "Clientes", url: "/clients", icon: Building2 }];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--brand-purple)] text-white font-bold">
            S
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold">Sales Portal</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
              {role ?? "—"}
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {role === "client" && (
          <SidebarGroup>
            <SidebarGroupLabel>Mi cuenta</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {clientItems.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {(role === "admin" || role === "staff") && (
          <SidebarGroup>
            <SidebarGroupLabel>Operaciones</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {opsItems.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {role === "admin" && (
          <SidebarGroup>
            <SidebarGroupLabel>Administración</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}

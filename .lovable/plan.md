
## Objetivo
Inicializar el "Sales Portal" como app TanStack Start con dos clientes de Supabase externos (Core y Hub), autenticación por roles (admin / staff / client) y un esqueleto navegable con datos mock estilizados.

## Paleta y estilo
- Tokens en `src/styles.css` (`@theme inline`, oklch):
  - `--brand-purple #563AB5` (primary)
  - `--brand-orange #F68016` (accent / CTA)
  - `--brand-pink #DD87CB` (highlight gráficos)
  - `--background #FFFFFF`, `--foreground #000000`
  - Dark mode con púrpura como superficie principal.
- Tipografía: Inter (system fallback). Componentes Shadcn ya instalados.

## Paso 1 — Doble cliente Supabase

Archivos nuevos:
- `src/integrations/supabase/core.ts` — `createClient(VITE_SUPABASE_CORE_URL, VITE_SUPABASE_CORE_ANON_KEY)` con `persistSession: true` (es el cliente de auth).
- `src/integrations/supabase/hub.ts` — `createClient(VITE_SUPABASE_HUB_URL, VITE_SUPABASE_HUB_ANON_KEY)` con `persistSession: false` (solo data).
- `src/integrations/supabase/types.ts` — tipos `AppRole = 'admin' | 'staff' | 'client'`, `ServiceMode = 'full_service' | 'self_managed'`, `CoreUser`, `CoreClient`.
- `.env.example` con las 4 variables `VITE_SUPABASE_CORE_*` y `VITE_SUPABASE_HUB_*`.

`AuthContext` (`src/context/AuthContext.tsx`):
- Listener `supabaseCore.auth.onAuthStateChange` + `getSession` inicial.
- Tras login, hace `select role, client_id, full_name from public.users where id = auth.uid()` en Core. Si rol = `client`, además hace `select id, schema_name, service_mode from public.clients` para guardar el contexto del cliente.
- Expone: `{ user, role, clientId, clientSchema, serviceMode, loading, signIn, signOut }`.
- Si falla la lectura del rol → `signOut` + redirige a `/login`.

## Paso 2 — Layout y rutas

Estructura de rutas (TanStack Start, archivos en `src/routes/`):
```
__root.tsx              shell + QueryClient + AuthProvider
index.tsx               redirige según rol
login.tsx               pantalla de login (pública)
forbidden.tsx           vista 403 limpia
_app.tsx                layout protegido (Sidebar + Navbar + Outlet). beforeLoad: requireAuth.
_app.dashboard.tsx          [client]  Dashboard de Campañas
_app.prospects.tsx          [client]  Base de Prospectos
_app.calendar.tsx           [client]  Calendario Unificado
_app.reports.tsx            [client]  Reportes
_app.hitl-client.tsx        [client + self_managed] HITL del cliente
_app.hitl.tsx               [admin|staff] Bandeja HITL Operativa
_app.prospecting.tsx        [admin|staff] Módulo de Prospección
_app.clients.tsx            [admin] Control de Clientes
```
- `beforeLoad` en `_app.tsx` redirige a `/login` si no hay sesión.
- Cada hoja usa un helper `requireRole(['admin','staff'])` que lanza `redirect('/forbidden')` si el rol no coincide. Para clientes `full_service` ocultar HITL en sidebar y bloquear la ruta.

Componentes de layout (`src/components/layout/`):
- `AppSidebar.tsx` (Shadcn `sidebar`, colapsable con icon-mini, ítems filtrados por rol y `service_mode`).
- `AppNavbar.tsx` con:
  - `NotificationsBell` (popover con lista mock).
  - `AccountSwitcher` (solo admin/staff; combobox de clientes mock que actualiza un `selectedClientId` en un `OperationsContext`).
  - `UserMenu` (avatar, signOut).

## Paso 3 — Vistas mock estilizadas

- **Login** (`login.tsx`): card centrado, logo, email+password, llama `supabaseCore.auth.signInWithPassword`. Toast en error. Redirige según rol al éxito.
- **Forbidden** (`forbidden.tsx`): ilustración minimal, código 403, copy, botones "Volver" y "Cerrar sesión".
- **Dashboard Cliente**: 4 KPI cards (Enviados / Aperturas / Respuestas / Reuniones) + `BarChart` de envíos por día + `LineChart` de tasa de apertura (Recharts con colores brand). Mock data en `src/lib/mocks/campaigns.ts`.
- **Base de Prospectos**: `DataTable` Shadcn con filtros por estado, empresa, sector; columnas: nombre, empresa, cargo, email, estado, última interacción. Mock en `src/lib/mocks/prospects.ts`.
- **Calendario Unificado**: header con selector mes/semana, grid mensual custom (Tailwind grid 7xN), badges de colores por cuenta de correo (3 cuentas mock). Click en evento → `Sheet` (Drawer lateral) "Dossier del Lead" con tabs Historial / Resumen IA / Datos. Mock en `src/lib/mocks/calendar.ts`.
- **Reportes**: card con descripción + botón "Generar PDF" (mock, dispara toast).
- **HITL Operativa (admin/staff)**: layout split — izquierda lista de leads pendientes, derecha panel de revisión con email propuesto, botones Aprobar / Editar / Rechazar. Usa `selectedClientId` del `OperationsContext` (mock; la query real a `supabaseHub` queda como TODO tipado).
- **Prospección**: form de variables de inyección (segmento, ICP, tono, volumen diario) con `react-hook-form` + Zod, botón "Guardar borrador" (mock).
- **Control de Clientes**: tabla de clientes con columnas nombre, schema_name, service_mode (toggle), estado (switch activo/inactivo), botón "Nuevo cliente" → Dialog con form.

## Detalles técnicos

- Dependencias a añadir: `recharts`, `date-fns`. Shadcn ya cubre el resto.
- `OperationsContext` (`src/context/OperationsContext.tsx`) guarda `selectedClientId` para vistas admin/staff; default = primer cliente mock.
- Mocks en `src/lib/mocks/*.ts` (clients, campaigns, prospects, calendar, hitl, notifications). Tipados para que swappear a queries reales de `supabaseHub` sea trivial.
- Comentario `// TODO(hub):` en cada punto donde luego irá la query real a `supabaseHub` filtrando por `clientSchema`.
- 403 se renderiza tanto desde `requireRole` (redirect) como cuando un usuario sin sesión válida intenta acceder a algo (`AuthContext` con rol desconocido).

## Fuera de alcance (esta iteración)
- Crear los proyectos Supabase, SQL de tablas o RLS (el usuario ya los gestiona externamente).
- Queries reales contra Hub.
- Integraciones reales de correo / generación de PDF.
- i18n, tests, deploy.

## Resultado esperado
App navegable con login funcional contra Core (cuando el usuario llene las env vars), Sidebar/Navbar consistentes, vistas mock pulidas para los tres perfiles, y guardas de rol que muestran 403 limpio en accesos indebidos.

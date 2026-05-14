# FONT-END-FOOD-MANAGER

## Required reading
- Install deps: `npm install`
- Run dev server: `npm run dev`
- Build: `npm run build`
- Start production build: `npm run start`
- Lint: `npm run lint`

Notes:
- `package.json` currently defines `dev`, `build`, `start`, and `lint` scripts only.
- There is no test script configured yet, so there is no project-native command for running all tests or a single test file.

## High-level architecture

This is a Next.js App Router project (Next 16 + React 19 + TypeScript strict mode) with path alias `@/*`.

### Application structure

- `app/` contains route segments for public pages, auth, table/guest ordering flow, and management pages.
- `components/` contains reusable UI and feature components.
- `queries/` contains TanStack Query hooks for client-side data fetching/mutations.
- `schemaValidations/` contains shared Zod schemas and request/response typing.
- `lib/` contains cross-cutting helpers, stores, logger, and utility functions.

### Auth and session model

- Auth uses NextAuth v5 (`config/authentication/auth.ts`) with credentials flow.
- Session state is provided at the app root (`app/layout.tsx`) via `SessionProvider`.
- Route gating is done in `proxy.ts` using `auth(...)` plus `privatePaths` from `lib/utils.ts`.
- Login UI lives under `app/(public)/(auth)/login/`, and authentication actions are in `config/authentication/actions.ts`.

### Data and API layering

The service layer follows the documented split in `services/README.md`:

- `services/http`: shared HTTP client wrappers (transport-level concerns only).
- `services/internal`: calls to the system backend (usable from client or server depending on module).
- `services/external`: third-party/partner calls; should run from server/API routes to avoid exposing secrets.

In practice:
- UI and route components call `queries/*` hooks.
- Query hooks delegate to `services/internal/*` clients.
- Server components/routes may call server-side service modules directly.

### Ordering flow (big picture)

The customer ordering path is primarily table/guest oriented:

1. Table/QR entry routes under `app/tables/*`.
2. Ordering UI at `app/tables/detail/[id]/TableOrderingPage.tsx`.
3. Guest order tracking at `app/orders/guest/page.tsx`.
4. Guest/session state is coordinated with Zustand store modules under `lib/stores` and query hooks in `queries/guests`.

### UI system

- Styling uses Tailwind CSS v4.
- Core primitives are in `components/ui/*` (Radix-based patterns).
- Forms use `react-hook-form` + `zodResolver` with schemas from `schemaValidations/*`.
- Toast notifications are provided by `components/ui/use-toast` and rendered via global toaster in app layout.

### Runtime configuration

- `next.config.ts` allows specific remote image hosts (`res.cloudinary.com`, `images.unsplash.com`, `source.unsplash.com`) and custom `allowedDevOrigins` entries for LAN development.

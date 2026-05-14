# Frontend Architecture

## Overview

Restaurant and table ordering management frontend built with:

- Next.js 16
- React 19
- TypeScript
- TanStack Query
- Zustand
- Tailwind CSS
- Axios

The app follows Next.js App Router architecture with separated routing, UI, service, resource, and state layers.

## Folder Structure

```
└── 📁font-end-food-manager-nextjs
    └── 📁app
        └── 📁(public)
            └── 📁(auth)
                └── 📁login
        └── 📁api
        └── 📁manage
        └── 📁menu
        └── 📁orders
            └── 📁guest
            └── 📁user
        └── 📁tables
            └── 📁detail
                └── 📁[id]
                    ├── page.tsx
                    ├── TableOrderingPage.tsx
            └── 📁scan
                └── 📁[uuid]
                    ├── page.tsx
            ├── layout.tsx
            ├── page.tsx
        └── 📁user
        ├── globals.css
        ├── layout.tsx
        ├── not-found.tsx
        ├── page.tsx
    └── 📁components
    └── 📁config
        └── 📁authentication
            ├── actions.ts
            ├── auth.ts
        ├── env.config.ts
    └── 📁constants
        └── 📁errors
        └── 📁keys
            ├── localStorage.key.ts
            ├── queryKeys.ts
        └── 📁types
        ├── error-reference.ts
    └── 📁lib
        └── 📁hooks
        └── 📁socket
        └── 📁stores
        ├── createResource.ts
        ├── logger.ts
        ├── utils.ts
    └── 📁public
    └── 📁queries
    └── 📁resources
    └── 📁services
        └── 📁http
            ├── apiError.ts
            ├── httpClient.ts
            ├── httpServer.ts
        └── 📁internal
            └── 📁admin
            └── 📁auth
            └── 📁customers
            ├── base-url.consants.ts

```
 ## Application structure

- `app/` contains route segments for public pages, auth, table/guest ordering flow, and management pages.
- `components/` contains reusable UI and feature components.
- `queries/` contains TanStack Query hooks for custom client-side data fetching/mutations.
- `schemaValidations/` contains shared Zod schemas and request/response typing.
- `lib/` contains cross-cutting helpers, stores, logger, and utility functions.

## Auth and session model

- Auth uses NextAuth v5 (`config/authentication/auth.ts`) with credentials flow.
- Session state is provided at the app root (`app/layout.tsx`) via `SessionProvider`.
- Route gating is done in `proxy.ts` using `auth(...)` plus `privatePaths` from `lib/utils.ts`.
- Login UI lives under `app/(public)/(auth)/login/`, and authentication actions are in `config/authentication/actions.ts`.

### Data and API layering

The service layer follows:

- `services/http`: shared HTTP client wrappers (transport-level concerns only).
- `services/internal`: calls to the system backend (usable from client or server depending on module).
- `services/external`: third-party/partner calls; should run from server/API routes to avoid exposing secrets.

In practice:

- Query hooks delegate to `services/internal/*` clients.
- Server components/routes may call server-side service modules directly.
```

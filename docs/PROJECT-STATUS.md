# PROJECT STATUS

Last Updated: 2026-05-15

---

# Current Phase

Frontend foundation and management system development with active user ordering experience improvements.

Current focus:
- admin dashboard
- table ordering flow
- user landing/order entry UX polish (`app/user/page.tsx`)
- reusable resource/query architecture
- responsive UI system

---

# Completed Features

## Authentication

- NextAuth v5 credentials flow
- login page
- protected routes
- session provider integration
- logout flow
- refresh token flow

---

## Resource Architecture

- centralized `createResource.ts`
- reusable CRUD abstraction
- automatic cache invalidation
- typed query/mutation generation
- support for `extraQueries`
- support for `extraMutations`

---

## Customer Ordering

- QR table access
- table detail ordering page
- guest order tracking
- cart state management
- user entry page with quick actions for table order, current order tracking, and QR flow (`app/user/page.tsx`)

---

## Management Dashboard

- dashboard layout
- dishes management
- tables management
- orders management
- users and roles
- roles and permissions

---

## Realtime System

- socket client setup
- admin realtime order updates
- guest realtime synchronization

---

# Current Architecture Decisions

## State Management

- TanStack Query for server state
- Zustand only for minimal client state

---

## API Layer

- axios shared client
- service-based API architecture
- resource abstraction over TanStack Query

---

## UI System

- Tailwind CSS v4
- reusable `components/ui/*`
- responsive-first approach

---

# In Progress

- management UI improvements
- dashboard analytics
- responsive optimization across user ordering screens
- query/resource cleanup
- reusable table components
- validating and polishing user page CTA/navigation experience

---

# Pending

- advanced RBAC UI
- realtime notifications
- optimistic UI improvements
- websocket reconnection handling
- performance optimization
- loading skeleton standardization

---

# Known Issues

- some duplicated query patterns still exist
- mobile responsiveness not fully consistent
- some pages need loading/error boundary cleanup

---

# Important Notes

- prefer `createResource.ts` over standalone CRUD hooks
- avoid direct API calls inside components
- keep business logic outside UI components
- update this file after significant changes
# PROJECT RULES

## Core Rules

- Prefer Server Components by default
- Do not fetch APIs directly inside UI components
- Use TanStack Query for async server state
- Keep business logic outside page components
- Reuse existing UI primitives before creating new ones
- Do not modify unrelated logic during UI redesign

## Data Fetching

- Use queries/\* hooks
- Use services/internal/\* for backend calls
- Avoid duplicate fetching

## State Management

- Zustand only for minimal global client state
- TanStack Query for server state

## UI Rules

- Use skill /ui-ux-pro-max when updating existing UI
- Use skill /frontend-design when creating new UI/design
- Keep responsive design mobile-friendly
- Reuse `components/ui/*` primitives first
- Do not modify unrelated business logic during UI redesign

## TanStack Query Rules

Prefer using:

```txt
@lib/createResource.ts
```

as the default TanStack Query abstraction layer.

Use `createResource(...)` before writing standalone:

- `useQuery`
- `useMutation`
- query key factories
- CRUD hooks
- invalidateQueries logic

Prefer:

- `extraQueries`
- `extraMutations`

for feature-specific custom behavior.

Avoid duplicating query boilerplate already handled by the resource system.

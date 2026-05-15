# PROJECT RULES

## Core Rules

- Prefer Server Components by default
- Do not fetch APIs directly inside UI components
- Use TanStack Query for async server state
- Keep business logic outside page components
- Reuse existing UI primitives before creating new ones
- Do not modify unrelated logic during UI redesign

## UI Theme Direction

The application should follow a:

- fresh
- bright
- friendly
- modern café-style UI

Design feeling:
- clean and spacious
- soft modern colors
- approachable restaurant experience
- premium but not luxury-dark
- modern startup café aesthetic

Preferred palette:

```txt
Primary        #FB923C
Secondary      #FDBA74
Accent Green   #34D399
Background     #FFFDF8
Surface        #FFFFFF
Soft Background#FEF3E2
Text           #1F2937
Muted          #6B7280
Border         #FED7AA
```

UI style preferences:
- large rounded cards
- soft shadows
- comfortable spacing
- clean typography
- food-focused visuals
- minimal visual clutter
- responsive-first layouts

Avoid:
- overly dark UI
- black/white corporate dashboards
- crowded marketplace-style layouts
- overly saturated fast-food colors
- excessive gradients or glassmorphism

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

# Star Wars: Rise of the Triumvirate (SWROTT)

A web CRPG set in the era of the Sith Triumvirate. Foundation build.

## Stack

- **Next.js 15** (App Router) + **TypeScript** strict
- **React Three Fiber** + Drei for the 3D world
- **Tailwind CSS** for UI (custom Sith design tokens)
- **Zustand** + Immer for runtime state
- **Dexie** (IndexedDB) for save persistence
- **Zod** for content schemas
- **Vitest** for unit tests

## Run

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm test         # unit tests
pnpm typecheck
pnpm build
```

## Project layout

```
src/
  app/                 # Next.js routes (landing + /play)
  game/
    engine/            # pure TS: combat, progression, rng, save
    data/schemas/      # Zod schemas for items, skills, ...
    scenes/            # R3F scenes (Korriban academy, ...)
    store/             # Zustand stores
    ui/                # React DOM HUD, panels, flows
```

## Status

**Phase 0 — Foundation** ✅
- Project scaffold, design tokens, routing
- R3F canvas with placeholder Korriban exterior
- HUD shell (HP/Force bars, hotbar, nav)
- Character creation + Continue (Dexie save round-trip)
- Combat damage formula + RNG (deterministic) with tests

Next: **Phase 1 — MVP** (Marauder class, full combat loop, Korriban Act I).
See `/memories/session/plan.md` for the full roadmap.

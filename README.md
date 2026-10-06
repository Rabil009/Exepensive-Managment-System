# Expense Management System

This pnpm workspace contains the frontend application shell in `frontend/` and the shared UI package in `ui/`. The `backend/` directory is reserved and empty.

# Expense Management System

Minimal React, TypeScript, and Vite architecture starter for a multi-developer SaaS product. It contains no product screens or backend implementation.

## Setup

Use Node 24.21.0 and pnpm 10.18.3. From the repository root:

```bash
corepack pnpm install
corepack pnpm dev
```

Run `corepack pnpm typecheck`, `corepack pnpm lint`, and `corepack pnpm build` before review.

## Structure

- `frontend/`: app entry, layouts, feature boundaries, and thin pages.
- `ui/`: the shared design foundation, themes, approved product template, icons, components, and patterns.
- `templates/`: reusable page structures.
- `backend/`: intentionally empty, with `.gitkeep` so Git tracks the folder.
- `docs/`: architecture, design rules, and contribution guidance.

Start with [frontend architecture](docs/frontend-architecture.md) and the [contribution guide](docs/contribution-guide.md).

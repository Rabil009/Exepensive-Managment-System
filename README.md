# Aura Expense Workspace

React, TypeScript, Vite, and Tailwind CSS application using the supplied Aura UI.

## Screens

- Overview: `/employee/dashboard`
- New Expense: `/employee/expenses/new`
- Reports: `/employee/reports`
- Cards & Limits: `/employee/cards`
- Analytics: `/employee/analytics` — supplied HTML layout, charts, card usage, funding split, and insights

All screens use the Finance UI system from `devlop-aditya`, configured for Employee navigation and content. Feature components, state, data, and styles live together under `frontend/src/features/`. The shared header, sidebar, theme, and utilities live under `frontend/src/shared/`. See [the Finance UI migration notes](docs/finance-ui-migration.md) for source mappings and preserved workflows.

See [the architecture guide](docs/architecture.md) for the folder map, feature ownership, storage keys, and verification commands.

## Run

```sh
corepack pnpm install
corepack pnpm dev
```

Open http://127.0.0.1:5173/. Run `corepack pnpm build` and `corepack pnpm lint` to verify changes.

## Data

Expense records and demo card settings are stored in this browser. Receipt OCR and card issuer services are not connected. Reports and Overview use the same expense records. Analytics reproduces the supplied HTML's static sample values and chart geometry; its filter and export controls are visual elements from that HTML.

## Finance portal from Aditya

The `devlop-aditya` Next.js app lives in `portals/finance/`. The Employee app in `frontend/` retains its UI, data, routes, and Vite commands.

```sh
corepack pnpm dev:finance
```

Open http://localhost:3000/ for the Finance login and http://localhost:3000/dashboard for its dashboard. `corepack pnpm build:finance` builds this portal. The default `corepack pnpm dev` continues to run Employee on port 5173.

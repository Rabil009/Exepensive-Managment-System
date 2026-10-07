# Aura Expense Workspace

React, Next.js, TypeScript, and Tailwind CSS application using the supplied Aura UI.

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

The `devlop-aditya` Next.js app lives in `portals/finance/`. The Employee app in `frontend/` uses Next.js App Router while retaining its UI, data, and route URLs.

```sh
corepack pnpm dev:finance
```

Open http://localhost:3000/ for the Finance login and http://localhost:3000/dashboard for its dashboard. `corepack pnpm build:finance` builds this portal. The default `corepack pnpm dev` continues to run Employee on port 5173.

Selecting **Employee Portal** and signing in redirects to the existing Employee dashboard. Run both apps locally. For deployment, configure `EMPLOYEE_PORTAL_URL` in the Finance app to the full deployed Employee dashboard URL before building.

## Employee Next.js runtime

Employee uses Next.js App Router in `frontend/app/`, with feature code under `frontend/src/features/`. Vite and React Router have been removed. `corepack pnpm dev` still serves Employee at http://127.0.0.1:5173/. Its browser storage keys and origin stay the same. `corepack pnpm --filter frontend start` serves a production build on the same port.

`/login` and `/employee/login` redirect to the shared login with Employee Portal selected. Configure `LOGIN_URL` in Employee for deployment, replacing the former `VITE_LOGIN_URL`. No Supabase connection or real authentication has been added.

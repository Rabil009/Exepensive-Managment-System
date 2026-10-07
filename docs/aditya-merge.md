# Aditya branch merge

- Target branch: `Rabil`.
- Employee checkpoint: `52a09b598a2a1ea610257a1c17a98d35ebd8d11f`.
- Merged source: `origin/devlop-aditya`, commit `69b6ce57706b6bba400f9b692f9ead14c96bccef`.

The source branch uses Next.js while Employee uses Vite. Its frontend is retained under `portals/finance/`, with its own package and TypeScript configuration. This avoids replacing Employee's entry point, routes, dependency versions, scripts, styles, and browser storage. Both packages share the pnpm workspace lockfile.

Merge conflicts in the original `frontend/` paths were resolved using the Employee checkpoint. The corresponding Finance files were retained in the new portal directory. The root package keeps existing commands and adds `dev:finance` and `build:finance`.

The apps run separately. The login Employee Portal target now redirects to the existing Employee dashboard through `/employee`. Login state and expense data remain separate between app origins. Configure `EMPLOYEE_PORTAL_URL` for deployed environments.

The Finance Turbopack root points to the workspace root so Next.js can resolve pnpm-linked dependencies. This is the only adaptation to the imported application configuration.

## Initial merge verification

- Employee build and lint passed.
- Finance production build and TypeScript checks passed for all imported routes.
- `git diff 52a09b5 -- frontend` is empty: all Employee frontend files are unchanged.
- All 86 imported Finance files match the source branch byte for byte except the documented `next.config.ts` workspace root adjustment.

## Latest Aditya update

- Merged `origin/devlop-aditya` commit `288eadf` into `Rabil`.
- Employee checkpoint before this update: `83164eb`.
- Applied the source's login layout, profile avatars, and sidebar fixes to `portals/finance/`.
- Removed Finance's old `SlideOutIconRail.tsx` as deleted upstream; its sidebar now handles collapse itself.
- Retained all Employee files, gray controls, and the login redirect to the Employee dashboard.
- Finance production build and TypeScript checks passed. All 12 upstream file changes match the source in the Finance portal, and Employee source matches the checkpoint exactly.

## Employee sidebar and shared login

Employee now uses the latest Aditya sidebar geometry: 240px expanded, 64px collapsed, 40px navigation rows, and 16px icons. One sidebar component handles both states. Employee keeps its continuous navigation list, user identity, and gray theme.

Employee `/login` and `/employee/login` open the shared Finance login page with `?portal=employee`, selecting Employee Portal automatically. Configure `VITE_LOGIN_URL` in Employee for deployments; both development servers must be running locally. Existing dashboard routes remain accessible directly. This adds shared login navigation, not authentication enforcement.

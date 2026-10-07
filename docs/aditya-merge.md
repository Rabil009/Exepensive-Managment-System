# Aditya branch merge

- Target branch: `Rabil`.
- Employee checkpoint: `52a09b598a2a1ea610257a1c17a98d35ebd8d11f`.
- Merged source: `origin/devlop-aditya`, commit `69b6ce57706b6bba400f9b692f9ead14c96bccef`.

The source branch uses Next.js while Employee uses Vite. Its frontend is retained under `portals/finance/`, with its own package and TypeScript configuration. This avoids replacing Employee's entry point, routes, dependency versions, scripts, styles, and browser storage. Both packages share the pnpm workspace lockfile.

Merge conflicts in the original `frontend/` paths were resolved using the Employee checkpoint. The corresponding Finance files were retained in the new portal directory. The root package keeps existing commands and adds `dev:finance` and `build:finance`.

The apps run separately. The login Employee Portal target now redirects to the existing Employee dashboard through `/employee`. Login state and expense data remain separate between app origins. Configure `EMPLOYEE_PORTAL_URL` for deployed environments.

The Finance Turbopack root points to the workspace root so Next.js can resolve pnpm-linked dependencies. This is the only adaptation to the imported application configuration.

## Verification

- Employee build and lint passed.
- Finance production build and TypeScript checks passed for all imported routes.
- `git diff 52a09b5 -- frontend` is empty: all Employee frontend files are unchanged.
- All 86 imported Finance files match the source branch byte for byte except the documented `next.config.ts` workspace root adjustment.

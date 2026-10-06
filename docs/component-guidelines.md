# Component guidelines

Check `ui/components`, `ui/patterns`, and `templates` before creating feature UI. Generic controls belong in `ui/components`; reusable combinations belong in `ui/patterns`; full-page structures belong in `templates`. Keep expense-specific logic out of these shared layers.

Use PascalCase for component names and folders, `useSomething.ts` for hooks, and camelCase for utility functions. Keep one implementation of each shared component and export it from its owning layer.

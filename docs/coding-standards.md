# Coding standards

Use TypeScript strict mode and named exports for components, hooks, and shared modules. Page entries use default exports for lazy route loading.

Keep feature code in its own folder. Use the ownership and dependency directions in [architecture.md](architecture.md). Put feature state and actions in hooks, visual sections in components, demo fixtures in data modules, and feature CSS in styles. Keep shared layout independent of feature UI.

Use the existing theme tokens for common colors, spacing, and typography. Keep specialized card artwork and feature-specific styling in the owning feature's CSS. Avoid inline style duplication and unrelated global selectors.

Format code with `corepack pnpm format`. Do not leave unused imports, stale implementations, commented-out code, or empty feature scaffolding.

Run typecheck, lint, and build before merging. Add tests when a real behavior needs verification.

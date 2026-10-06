# Folder structure

`frontend/src/features` owns business-specific frontend code. Create `components`, `hooks`, `services`, `types`, or `utils` inside a feature only when needed. `frontend/src/pages` composes features, layouts, shared patterns, and templates. `frontend/src/layouts` owns the product shell.

`ui/src/foundation` owns raw tokens. `ui/src/themes` maps them to semantic roles. `ui/src/theme-templates/expense-saas` is the approved product visual template. `ui/src/components` contains generic controls, `ui/src/patterns` contains reusable combinations, and root `templates` contains page structures. `backend` has no implementation yet.

# Frontend architecture

The dependency direction is `ui/foundation` → `ui/themes` → `ui/theme-templates` → `ui/components` → `ui/patterns` → `templates` → `frontend/layouts` → `frontend/features` → `frontend/pages` → `frontend/app`. Lower layers never import from higher layers.

The frontend has a minimal application entry. Add routes only when real pages are ready. Keep business-specific UI and state in feature folders, shared application services in `frontend/src/services`, and page files focused on composition.

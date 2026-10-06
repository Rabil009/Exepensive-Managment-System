# Theming

`ui/src/foundation` is the only source of raw visual values. `ui/src/themes` maps them to semantic roles for light and dark modes. `ThemeProvider` applies semantic CSS variables to the document. `ui/src/theme-templates/expense-saas` is the approved product template for cards, forms, tables, sidebar, header, and surfaces.

Feature code should consume semantic roles or shared components. Do not define independent feature palettes or visual systems.

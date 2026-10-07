# Frontend architecture

## Folder map

```text
frontend/src/
  app/App.tsx                 Route definitions and expense provider
  main.tsx                    React entry point
  features/
    overview/                 Overview page, summary, receipt shortcut, expense table
    expenses/                 New Expense page and the shared expense domain
    reports/                  Report detail, summary, approval flow, transaction ledger
    cards/                    Physical card, limits, controls, transactions, dialogs
    analytics/                Supplied HTML sections, charts, card usage, funding, insights
  shared/
    components/               AuraIcon, Toast, Finance StatusBadge
    layout/                   AppShell, Finance Sidebar/Header/SlideOutIconRail, navigation
    theme/                    Finance ThemeProvider and useTheme
    styles/                   Finance theme tokens, compatibility aliases, shared styles
    utils/                    Currency/date formatting and CSV export
```

Each implemented feature has a page entry, `components/`, `hooks/`, and `data/` as needed. Expenses, Reports, Cards, and Analytics keep their CSS in their own `styles/` folder. Do not create empty folders for planned features.

## Where to make changes

| Task                                        | Location                                                                        |
| ------------------------------------------- | ------------------------------------------------------------------------------- |
| Routes and page loading                     | `frontend/src/app/App.tsx`                                                      |
| Navigation labels and URLs                  | `frontend/src/shared/layout/navigation.ts`                                      |
| Sidebar branding or profile                 | `frontend/src/shared/layout/Sidebar.tsx`                                        |
| Sidebar sizes, icon rail, mobile layout     | `frontend/src/shared/styles/shell.css`                                          |
| Header search, notifications, toggle        | `frontend/src/shared/layout/Header.tsx`                                         |
| Theme colors, spacing, typography           | `frontend/src/shared/styles/global.css`                                         |
| Overview filters and export                 | `frontend/src/features/overview/hooks/useOverview.ts`                           |
| New Expense draft, receipt, submit behavior | `frontend/src/features/expenses/hooks/useExpenseForm.ts`                        |
| Expense persistence shared across screens   | `frontend/src/features/expenses/data/ExpensesContext.tsx`                       |
| Expense types                               | `frontend/src/features/expenses/types.ts`                                       |
| Sample expense records                      | `frontend/src/features/expenses/data/demoExpenses.ts`                           |
| Reports selection, totals, filters, recall  | `frontend/src/features/reports/hooks/useReports.ts` and `utils/reportTotals.ts` |
| Report appearance                           | `frontend/src/features/reports/components/` and `styles/reports.css`            |
| Card appearance and proportions             | `frontend/src/features/cards/components/CardPreview.tsx` and `styles/cards.css` |
| Card state and dialog actions               | `frontend/src/features/cards/hooks/useCardControls.ts`                          |
| Sample card limits and transactions         | `frontend/src/features/cards/data/demoCards.ts`                                 |
| Analytics source reference                  | `docs/design-references/analytics.html`                                         |
| Analytics appearance                        | `frontend/src/features/analytics/components/` and `styles/analytics.css`        |

## Responsibilities

- **Page entries** arrange sections and connect the shared shell to a feature hook.
- **Components** render their section and receive typed values and callbacks. `Pick` types describe which hook values a section uses.
- **Hooks** own state, filters, validation, local storage, and user actions.
- **Data modules** contain fixtures and configuration. Demo card data and approval steps are explicitly named as demo fixtures.
- **Shared utilities** implement genuinely reused behavior. CSV escaping and download behavior have one implementation.
- **Shared layout** owns navigation, header, sidebar, and shell styling. It does not import feature components or feature styles.
- **The expense domain** is reused by Overview and Reports. Avoid importing another feature's visual components.

Overview is ordinary React JSX. It no longer injects an HTML template, mounts rows through a portal, or manually changes DOM classes and counters.

## Data and limitations

- `employee-expenses-v1`: user expense records, merged with sample records.
- `aura-expense-draft-v1`: current expense form draft.
- `aura-demo-card-v1`: local demo card settings and virtual cards.
- `aura-recalled-reports`: local demo report recall state.
- `aura-sidebar-expanded`: sidebar display preference.
- `finpulse-theme`: shared Finance/Employee light or dark theme preference.

Existing storage keys are preserved by the reorganization. Receipt files are previewed in memory; filenames are stored with expense records. There is no backend, OCR service, card issuer integration, or bank feed connection. Overview summary values and compliance indicators retain the supplied demo presentation. Card controls and approval workflow are demos. Reports derive expense totals from shared records and keep currencies separate; their quarterly chart uses USD records from Q4 2025.

Analytics reproduces the user's supplied HTML directly as six React section components. Its sample amounts, SVG geometry, category shares, weekly card bars, workflow rows, funding split, and insights come from `docs/design-references/analytics.html`. Filter, interval, and export buttons are the supplied static visual controls. The shared shell provides working navigation and sidebar collapse. The previous custom Analytics calculations, table, and extra chart have been removed.

Supplied screenshots and HTML exports are archived under `docs/design-references/`. They are documentation assets and are not imported into the app or shipped in its bundle.

The Finance UI components and tokens are sourced from `devlop-aditya`. See [the migration guide](finance-ui-migration.md) for exact source mappings, component configuration, and scope limitations. Employee class names are aliases to the shared Finance tokens; they do not define another theme.

## Verification

From the repository root:

```sh
corepack pnpm typecheck
corepack pnpm lint
corepack pnpm build
corepack pnpm format:check
```

Use `corepack pnpm format` after editing. Manually verify the affected user flow when changing a hook or moving components. For cross-feature refactors, check Overview filtering, expense draft/submit, report filters and Add Item, card dialogs/controls, and sidebar collapse/navigation.

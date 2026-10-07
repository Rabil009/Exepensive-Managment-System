# Employee UI alignment with Finance

Reference: `devlop-aditya` at `69b6ce57706b6bba400f9b692f9ead14c96bccef`.

The reference portal uses Next.js. This Employee branch uses Vite and React Router, so its routes and runtime stay intact. Finance's presentational components are reused under `frontend/src/shared/` with props replacing their direct Finance-store dependencies.

## Reused implementation

| Finance source                              | Employee shared implementation       | Integration                                                                                                             |
| ------------------------------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `components/dashboard/Sidebar.tsx`          | `shared/layout/Sidebar.tsx`          | Finance width, branding, navigation treatments, and profile layout; Employee navigation and user supplied through props |
| `components/dashboard/Header.tsx`           | `shared/layout/Header.tsx`           | Shared theme toggle with restored Employee search, static USD display, notifications, and New Expense                   |
| `components/dashboard/SlideOutIconRail.tsx` | `shared/layout/SlideOutIconRail.tsx` | Persistent 48px collapsed rail with centered 20px outline icons and accessible Employee navigation                      |
| `lib/theme-store.tsx`                       | `shared/theme/theme-store.tsx`       | Same provider, `useTheme()`, `.dark` class, and `finpulse-theme` storage key                                            |
| `app/globals.css`                           | `shared/styles/finance-theme.css`    | Finance canvas, surface, border, text, and chart tokens; landing-only styles omitted                                    |
| `components/shared/StatusBadge.tsx`         | `shared/components/StatusBadge.tsx`  | Same flat indicator dots and tones; used for Employee expense, receipt, report, and transaction statuses                |
| `app/dashboard/page.tsx` shell              | `shared/layout/AppShell.tsx`         | 235px expanded sidebar, 48px collapsed rail, restored 64px Employee header, and 24px content padding                    |

Employee class names in `global.css` are compatibility aliases to the Finance tokens. There is one theme provider at the application root. Mobile sidebar presentation adds an overlay; the existing employee search, notifications, and New Expense action remain available.

## Modified files

- Shared layout: `AppShell.tsx`, `Sidebar.tsx`, `Header.tsx`, `SlideOutIconRail.tsx`, `navigation.ts`, and `navigation.types.ts` under `frontend/src/shared/layout/`; removed `AuraShell.tsx`.
- Shared theme and styling: `shared/theme/theme-store.tsx`, `shared/styles/finance-theme.css`, `shared/styles/global.css`, and `shared/styles/shell.css`.
- Shared components/utilities: `shared/components/StatusBadge.tsx` and `shared/utils/classes.ts`.
- Provider integration: `frontend/src/main.tsx`.
- Five feature page entries: `OverviewPage.tsx`, `NewExpensePage.tsx`, `ReportsPage.tsx`, `CardsPage.tsx`, and `AnalyticsPage.tsx`.
- Employee section styling: `OverviewExpenseTable.tsx`, `CardTransactions.tsx`, `ApprovalWorkflow.tsx`, `ReportHeader.tsx`, `ReportTransactions.tsx`, `SpendDistribution.tsx`, and Analytics `SpendingOverview.tsx`.
- Feature CSS: `features/expenses/styles/expense-form.css`, `features/cards/styles/cards.css`, and `features/reports/styles/reports.css`.
- Report chart palette: `features/reports/hooks/useReports.ts` (color strings only).
- Dependency: `frontend/package.json` and `pnpm-lock.yaml` add the reference's `lucide-react` icon library.
- Documentation: `README.md`, `docs/architecture.md`, and this migration guide.

## Preserved Employee behavior

- All five routes and page sections.
- Overview expense filtering, counts, column visibility, receipt capture, and CSV export.
- New Expense receipt handling, draft state, validation, categories, payment methods, attendees, and submission.
- Report selection, totals, filtering, recall, Add Item, CSV, and print/PDF action.
- Physical card proportions, card security settings, freeze/reveal, dialogs, and transaction filters.
- Analytics sample values, SVG geometry, category meanings, weekly bars, workflow rows, and funding split. Its supplied controls remain static.
- Existing expense, draft, card, report-recall, and sidebar storage keys.

The former `AuraShell`, Aura sidebar/header implementations, and sidebar layout CSS are replaced. Employee hooks and fixtures are unchanged; `useReports.ts` changes only the four chart color strings to Finance theme variables.

## Scope and remaining limits

Finance and Manager routes do not exist in this Vite branch. Cross-role switching cannot be exercised here; the reusable UI is configured for Employee. Existing demo integrations and static Analytics controls remain as before. No Finance business data, stores, queue views, or navigation items were imported.

Validate with `corepack pnpm build`, `corepack pnpm typecheck`, `corepack pnpm lint`, and `corepack pnpm format:check`. Check light/dark mode, all Employee routes, expense search, report filtering, card dialogs, sidebar close/reveal/pin, and mobile navigation.

## Sidebar refinement

The side panel owns the sidebar toggle, shown as an icon beside Payout when expanded and directly above Search when collapsed. The header has no sidebar toggle. The hover-only rail controls are removed. Collapsed navigation stays visible with 20px outline icons, high contrast in both themes, and native title labels.

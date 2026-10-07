---
name: Executive Precision
colors:
  surface: '#faf8fe'
  surface-dim: '#dad9df'
  surface-bright: '#faf8fe'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f8'
  surface-container: '#eeedf3'
  surface-container-high: '#e9e7ed'
  surface-container-highest: '#e3e2e7'
  on-surface: '#1a1b1f'
  on-surface-variant: '#414753'
  inverse-surface: '#2f3034'
  inverse-on-surface: '#f1f0f5'
  outline: '#717785'
  outline-variant: '#c1c6d6'
  surface-tint: '#005cbb'
  primary: '#0059b5'
  on-primary: '#ffffff'
  primary-container: '#0071e3'
  on-primary-container: '#fcfbff'
  inverse-primary: '#abc7ff'
  secondary: '#5f5e60'
  on-secondary: '#ffffff'
  secondary-container: '#e2dfe1'
  on-secondary-container: '#636264'
  tertiary: '#006a26'
  on-tertiary: '#ffffff'
  tertiary-container: '#008633'
  on-tertiary-container: '#f1ffec'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d7e2ff'
  primary-fixed-dim: '#abc7ff'
  on-primary-fixed: '#001b3f'
  on-primary-fixed-variant: '#00458f'
  secondary-fixed: '#e4e2e4'
  secondary-fixed-dim: '#c8c6c8'
  on-secondary-fixed: '#1b1b1d'
  on-secondary-fixed-variant: '#474649'
  tertiary-fixed: '#72fe88'
  tertiary-fixed-dim: '#53e16f'
  on-tertiary-fixed: '#002107'
  on-tertiary-fixed-variant: '#00531c'
  background: '#faf8fe'
  on-background: '#1a1b1f'
  surface-variant: '#e3e2e7'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.024em
  display-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.018em
  headline-lg:
    fontFamily: Inter
    fontSize: 19px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.012em
  headline-sm:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: -0.008em
  body-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: -0.004em
  body-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: -0.002em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0em
  financial-display:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  financial-tabular:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-caps:
    fontFamily: Inter
    fontSize: 10.5px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system embodies the calculated elegance, architectural restraint, and quiet confidence of modern desktop operating systems and premier financial tools. Built specifically for desktop enterprise expense governance, it strips away visual noise in favor of radical clarity, tactile digital materials, and pristine typographic hierarchy.

The visual style blends **Apple-inspired Modernism** with the high-density focus of elite productivity software. It projects institutional trust without institutional staleness. Every surface feels milled, calibrated, and deliberate. Interfaces must feel effortless to navigate during multi-thousand-dollar reconciliation workflows, evoking calm control, mathematical precision, and prestige.

## Colors

The palette operates on a principle of absolute visual austerity, allowing financial data and transaction statuses to command attention without visual fatigue.

### Core Canvas & Surfaces
- **Window Base Canvas:** `#F5F5F7` provides structural grounding for split-views and sidebars.
- **Surface Elevation (Cards, Tables, Sheets):** `#FFFFFF` pure white, creating soft physical layering over the window base.
- **Secondary Well / Inset Canvas:** `#FBFBFD` used for nested metric groups and search fields.
- **Subtle Surface Dividers:** Hairline borders using `rgba(0, 0, 0, 0.06)` or `#E5E5EA`.

### Typographic Neutral Hierarchy
- **Primary Ink:** `#1D1D1F` (macOS Deep Graphite) ensures optimal contrast and authoritative legibility for values, headings, and primary titles.
- **Secondary Ink:** `#86868B` for metadata, column headers, and structural labels.
- **Tertiary Ink:** `#A1A1A6` for inactive icons, input placeholders, and timestamp details.

### Functional Accents (Strict Restraint)
- **Interactive Primary:** `#0071E3` (Apple System Blue) reserved strictly for primary execution flows (e.g., "Submit Batch", "Approve Report") and focused keyboard states.
- **Settled / Approved:** `#34C759` paired with an ultra-light tint (`rgba(52, 199, 89, 0.10)`) for approved disbursements and cleared accounts.
- **Pending / In Review:** `#FF9500` with `rgba(255, 149, 0, 0.10)` for items awaiting manager sign-off or multi-sig consensus.
- **Policy Flag / Critical:** `#FF3B30` with `rgba(255, 59, 48, 0.08)` for compliance exceptions, duplicate charge detections, and over-limit warnings.

## Typography

Typography relies on `Inter` tuned for dense, structured operating-system environments. Optical sizing is prioritized with exact tracking offsets that mimic native Apple San Francisco rendering across macOS platforms.

### Typographic Rules & Financial Figures
- **Tabular Lining Figures (`font-feature-settings: "tnum" 1`):** Mandatory for all balances, financial figures, transaction logs, timestamps, and account numbers to prevent horizontal shifting across live data updates.
- **Negative Tracking on Display:** Headings must carry proportional negative tracking (`-0.012em` to `-0.024em`) to ensure titles lock together cleanly without appearing loose.
- **Uppercase Column Identifiers:** Small subheaders and table columns utilize `label-caps` in secondary ink (`#86868B`), rendered in uppercase with gentle tracking (`+0.05em`) for immediate scan-ability across dense spreadsheets.

## Layout & Spacing

The layout is built on an unwavering **8pt base grid** (with a secondary 4pt half-step for micro-alignments such as badge padding and icon-to-label gaps).

### Desktop Widescreen Architecture
- **Navigation Sidebar (Fixed):** 240px fixed width docked to the left edge with translucent visual treatment (`#F5F5F7` backdrop).
- **Primary Content Stage (Fluid):** Fluid workspace spanning a constrained maximum content width of `1600px` to prevent sprawling horizontal transaction tables on ultra-wide 4K/5K displays.
- **Contextual Inspector / Detail Tray (Collapsible):** 380px slide-out drawer on the right for line-item receipt inspection, audit trails, and multi-currency conversion logs.

### Rhythm & Alignment
Section padding follows strict internal steps:
- Data cards and summary modules utilize `space-lg` (20px) internal breathing room.
- Table row height is locked to 44px (compact) or 52px (standard inspection) to maintain a rhythm aligned with native desktop click targets.
- Component gutters inside forms and data tables strictly scale via `space-md` (12px) and `space-sm` (8px).

## Elevation & Depth

Visual hierarchy does not rely on heavy drop shadows or saturated card borders. Instead, depth is achieved through **optical material layering**, translucent blurred substrates, and ultra-fine atmospheric shadows.

### The Material Stack
1. **Desktop Canvas (`#F5F5F7`):** The structural base beneath all windows and splitters.
2. **Frosted Translucent Topbars & Navigation:**
   - Background: `rgba(245, 245, 247, 0.82)`
   - Backdrop filter: `blur(20px) saturate(180%)`
   - Border bottom: `1px solid rgba(0, 0, 0, 0.06)`
3. **Card & Table Container Surfaces (`#FFFFFF`):**
   - Micro ambient shadow: `0 1px 2px rgba(0, 0, 0, 0.03), 0 0 0 1px rgba(0, 0, 0, 0.05)`
4. **Floating Popovers & Flyout Menus:**
   - Background: `rgba(255, 255, 255, 0.95)` with `blur(24px)`
   - Elevation shadow: `0 4px 12px rgba(0, 0, 0, 0.05), 0 12px 32px rgba(0, 0, 0, 0.06)`
   - Border: `1px solid rgba(0, 0, 0, 0.08)`
5. **Modal Confirmation Windows:**
   - Elevation shadow: `0 24px 48px -12px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.06)`

## Shapes

The geometric framework mirrors modern desktop app conventions, relying on smooth squircle-like radius curves.

### Corner Hierarchy
- **Canvas Workstations & Large Cards:** 12px to 14px outer corner radius, creating a unified window enclosure.
- **Interactive Inputs & Buttons:** 8px radius for a firm, precise interactive target that feels crisp and compact.
- **Status Indicators & Pill Tags:** Fully circular / capsule radius (`9999px`) to immediately distinguish analytical attributes from operational data cards.
- **Sidebar Selection Indicator:** 6px radius nested inside the 8px container padding.

## Components

### Buttons
- **Primary:** Solid `#0071E3` fill, `#FFFFFF` text, 32px height (desktop compact), 8px border radius. Subtle hover: brightness shift to `#0077ED`. Active state: scale down to `0.985` for tactile click feedback.
- **Secondary (Default Desktop Action):** Pure white `#FFFFFF` surface with `0 0 0 1px rgba(0, 0, 0, 0.08)` hairline border and subtle `0 1px 2px rgba(0,0,0,0.04)` shadow. Text `#1D1D1F`. Hover: `#F5F5F7`.
- **Tertiary / Ghost:** No border or fill, `#1D1D1F` text. Hover: `rgba(0, 0, 0, 0.04)` background fill.

### Status Badges & Chips
- Capsule-shaped with a fixed height of 22px, padding `0 10px`.
- Composed of an ultra-subtle tinted surface fill, tinted foreground text, and an optional 6px solid circular status dot.
  - **Approved:** Background `rgba(52, 199, 89, 0.12)`, Text `#1B8738`.
  - **Pending:** Background `rgba(255, 149, 0, 0.12)`, Text `#B26200`.
  - **Action Required / Flagged:** Background `rgba(255, 59, 48, 0.10)`, Text `#D70015`.

### Expense Tables & Data Rows
- **Header:** Sticky top with `rgba(255, 255, 255, 0.90)` blur, 36px height, uppercase muted micro-type with subtle sort chevrons.
- **Rows:** 48px baseline height, divided by a 1px hairline border (`rgba(0, 0, 0, 0.04)`). Hover state renders a soft rounded background highlight (`#F5F5F7`) inset by 4px from table margins.
- **Amounts:** Right-aligned, `financial-tabular` styling, with deep charcoal for expenditures and muted green for credit/reimbursement transactions.

### Input Fields & Controls
- **Text & Numeric Inputs:** 32px height, `#FFFFFF` fill, `0 0 0 1px rgba(0, 0, 0, 0.12)` border. On focus: transitions smoothly to `0 0 0 2px #0071E3` with zero outward blur.
- **Segmented Controls (Desktop Filter Bars):** Pill-container in `#E5E5EA` background with 2px inner padding; selected segment renders as an elevated `#FFFFFF` card with soft `0 1px 3px rgba(0, 0, 0, 0.08)` drop shadow.

### Cards & Summary Metrics
- Clean white surfaces with 12px radius and 1px muted perimeter line.
- Metrics display the large headline amount stacked over a quiet secondary label, paired with a miniature Sparkline in monochrome charcoal (`#1D1D1F`) rather than neon fills.

### Contextual Receipt Inspector
- Slide-over sheet mounted directly on the right grid, housing high-resolution receipt thumbnails, optical character recognition (OCR) metadata confirmation fields, and an immutable visual audit log.
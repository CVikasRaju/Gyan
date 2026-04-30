# CurrentAI — Design System
### For Antigravity Agent: UI Build Reference

> **How to use this file:** Every UI decision — color, spacing, component structure, screen layout — must follow this document. Do not invent styles. If a pattern is not listed here, use the closest matching token and flag for review.

---

## 1. Brand Identity

| Attribute | Value |
|---|---|
| **Product Name** | CurrentAI |
| **Tagline** | *Fact-checked. Source-attributed. Ad-free.* |
| **Personality** | Trustworthy, clean, editorial, minimal |
| **Anti-patterns** | No banner ads, no auto-play, no dark patterns, no cluttered sidebars |
| **Closest reference** | The Economist web + Linear app aesthetics |

---

## 2. Color System

### 2.1 Base Palette

| Token | Hex | Usage |
|---|---|---|
| `--color-bg-primary` | `#0F1117` | Main page background |
| `--color-bg-secondary` | `#171B26` | Card / panel background |
| `--color-bg-tertiary` | `#1E2433` | Hover states, subtle elevation |
| `--color-bg-overlay` | `#252B3B` | Modals, dropdowns |
| `--color-border` | `#2A3045` | Default border |
| `--color-border-subtle` | `#1E2433` | Dividers, table rows |

### 2.2 Brand Accent

| Token | Hex | Usage |
|---|---|---|
| `--color-accent-primary` | `#4F8EF7` | CTAs, active states, links |
| `--color-accent-hover` | `#6BA3F9` | Hover on accent elements |
| `--color-accent-muted` | `#1C2D4F` | Accent backgrounds (badges, chips) |

### 2.3 Semantic Colors

| Token | Hex | Usage |
|---|---|---|
| `--color-success` | `#22C55E` | QA passed badge, positive states |
| `--color-success-muted` | `#0D2D1A` | Success badge background |
| `--color-warning` | `#F59E0B` | Flagged content badge |
| `--color-warning-muted` | `#2D1F0A` | Warning badge background |
| `--color-danger` | `#EF4444` | Quarantined content, errors |
| `--color-danger-muted` | `#2D0F0F` | Error badge background |
| `--color-neutral` | `#6B7280` | Disabled states, placeholders |

### 2.4 Text Colors

| Token | Hex | Usage |
|---|---|---|
| `--color-text-primary` | `#F1F5F9` | Headings, primary body text |
| `--color-text-secondary` | `#94A3B8` | Supporting text, metadata |
| `--color-text-muted` | `#4B5563` | Timestamps, captions |
| `--color-text-inverse` | `#0F1117` | Text on light/accent backgrounds |
| `--color-text-link` | `#4F8EF7` | Anchor links |
| `--color-text-link-hover` | `#6BA3F9` | Anchor links on hover |

---

## 3. Typography

### 3.1 Font Stack

```css
--font-sans: 'Inter', 'SF Pro Text', system-ui, -apple-system, sans-serif;
--font-serif: 'Lora', 'Georgia', serif; /* Article body / editorial feel */
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

> **Agent note:** Use `--font-serif` only for article summary body text on the Article Detail View (S2). All UI chrome uses `--font-sans`.

### 3.2 Type Scale

| Token | Size | Line Height | Weight | Usage |
|---|---|---|---|---|
| `--text-display` | 32px | 1.2 | 700 | Page hero titles only |
| `--text-heading-1` | 24px | 1.3 | 700 | Section headings |
| `--text-heading-2` | 20px | 1.35 | 600 | Card titles, screen headers |
| `--text-heading-3` | 16px | 1.4 | 600 | Sub-section labels |
| `--text-body-lg` | 16px | 1.6 | 400 | Article summary body |
| `--text-body` | 14px | 1.6 | 400 | Default UI body text |
| `--text-body-sm` | 13px | 1.5 | 400 | Supporting content |
| `--text-caption` | 12px | 1.4 | 400 | Timestamps, metadata |
| `--text-label` | 11px | 1.3 | 600 | Category chips, badges (uppercase) |

### 3.3 Text Rules

- Maximum line length for article body: `72ch`
- Never use font-weight below 400 in UI
- Category labels and badges: always `uppercase` + `letter-spacing: 0.08em`
- Source attribution text: always `--text-caption` + `--color-text-muted`

---

## 4. Spacing System

Based on a **4px base unit**. Always use multiples of 4.

| Token | Value | Usage |
|---|---|---|
| `--space-1` | 4px | Icon padding, micro gaps |
| `--space-2` | 8px | Compact inner padding |
| `--space-3` | 12px | Badge/chip padding |
| `--space-4` | 16px | Default card padding (mobile) |
| `--space-5` | 20px | Form field padding |
| `--space-6` | 24px | Card padding (desktop) |
| `--space-8` | 32px | Section gap |
| `--space-10` | 40px | Large section separation |
| `--space-12` | 48px | Page-level vertical rhythm |
| `--space-16` | 64px | Hero sections |

---

## 5. Border & Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 4px | Badges, chips, small tags |
| `--radius-md` | 8px | Buttons, inputs |
| `--radius-lg` | 12px | Cards |
| `--radius-xl` | 16px | Modal dialogs |
| `--radius-full` | 9999px | Pills, avatar circles |
| `--border-default` | `1px solid var(--color-border)` | Cards, inputs |
| `--border-subtle` | `1px solid var(--color-border-subtle)` | Dividers |
| `--border-accent` | `1px solid var(--color-accent-primary)` | Focus rings, active states |

---

## 6. Shadows & Elevation

| Token | Value | Usage |
|---|---|---|
| `--shadow-sm` | `0 1px 3px rgba(0,0,0,0.4)` | Subtle card lift |
| `--shadow-md` | `0 4px 12px rgba(0,0,0,0.5)` | Hovered cards, dropdowns |
| `--shadow-lg` | `0 8px 32px rgba(0,0,0,0.6)` | Modals, popovers |
| `--shadow-accent` | `0 0 0 3px rgba(79,142,247,0.25)` | Focus ring on interactive elements |

---

## 7. Layout & Grid

### 7.1 Page Container

```
Max width:     1200px
Side padding:  24px (desktop) / 16px (mobile)
Center aligned on page
```

### 7.2 Grid System

| Breakpoint | Name | Min Width | Columns | Gutter |
|---|---|---|---|---|
| xs | Mobile | 0px | 4 | 16px |
| sm | Tablet | 640px | 8 | 20px |
| md | Laptop | 768px | 12 | 24px |
| lg | Desktop | 1024px | 12 | 24px |
| xl | Wide | 1280px | 12 | 24px |

### 7.3 Content Zones

```
Digest Feed (S1):     3-column grid (desktop) / 1-column (mobile)
Article Detail (S2):  Single centered column, max 720px
Category Filter (S3): 3-column grid with sticky filter bar
Admin Dashboard (S4): 2-column split — list (60%) + detail panel (40%)
```

---

## 8. Components

### 8.1 Digest Card (Primary repeating unit — S1, S3)

```
Structure:
┌─────────────────────────────────┐
│ [CATEGORY CHIP]   [TIMESTAMP]   │  ← top metadata row
│                                 │
│ Headline / Summary Title        │  ← --text-heading-2
│                                 │
│ Summary body text (2-3 lines,   │  ← --text-body, clamped to 3 lines
│ truncated with ellipsis)        │
│                                 │
│ [SOURCE LOGO] Source Name  →    │  ← --text-caption, link to article
│ [QA STATUS BADGE]               │
└─────────────────────────────────┘

Specs:
- Background:  --color-bg-secondary
- Border:      --border-default
- Radius:      --radius-lg
- Padding:     --space-6
- Hover state: background → --color-bg-tertiary, shadow → --shadow-md
- Cursor:      pointer
- Transition:  background 150ms ease, box-shadow 150ms ease
```

### 8.2 Category Chip

```
Specs:
- Font:        --text-label (11px, uppercase, letter-spacing 0.08em)
- Padding:     4px 8px
- Radius:      --radius-sm
- Background:  --color-accent-muted
- Text color:  --color-accent-primary
- Border:      none

Category color variants:
  Politics    → background: #1C2D4F  text: #4F8EF7
  Economy     → background: #1F2D1A  text: #22C55E
  Science     → background: #2D1F3A  text: #A855F7
  World       → background: #2D2A1A  text: #F59E0B
  Technology  → background: #1A2D2D  text: #06B6D4
  Health      → background: #2D1A1A  text: #EF4444
```

### 8.3 QA Status Badge

```
passed      → bg: --color-success-muted    text: --color-success    label: "Verified"
flagged     → bg: --color-warning-muted    text: --color-warning    label: "Under Review"
quarantined → bg: --color-danger-muted     text: --color-danger     label: "Quarantined"

Specs:
- Font:    --text-label
- Padding: 3px 8px
- Radius:  --radius-full
- Always show a 6px dot (●) before the label in matching color
```

### 8.4 Button

```
Primary Button:
- Background:  --color-accent-primary
- Text:        --color-text-inverse
- Font:        --text-body, weight 600
- Padding:     10px 20px
- Radius:      --radius-md
- Hover:       background → --color-accent-hover
- Active:      scale(0.98)
- Disabled:    opacity 0.4, cursor not-allowed
- Transition:  background 150ms ease

Secondary Button:
- Background:  transparent
- Border:      --border-accent
- Text:        --color-accent-primary
- Hover:       background → --color-accent-muted

Ghost Button:
- Background:  transparent
- Border:      --border-default
- Text:        --color-text-secondary
- Hover:       background → --color-bg-tertiary
```

### 8.5 Input Field

```
- Background:  --color-bg-tertiary
- Border:      --border-default
- Border-radius: --radius-md
- Padding:     10px 14px
- Font:        --text-body, --color-text-primary
- Placeholder: --color-text-muted
- Focus:       border → --border-accent, box-shadow → --shadow-accent
- Error state: border → 1px solid --color-danger
- Height:      40px (default), 36px (compact)
```

### 8.6 Search Bar

```
- Full width of its container
- Left icon: search icon (20px, --color-text-muted)
- Padding-left: 40px (to clear icon)
- Clear button (×) appears on right when value is non-empty
- Height: 44px
- Radius: --radius-md
- Keyboard shortcut hint: show "⌘K" badge on right when empty (desktop only)
```

### 8.7 Navigation Bar (Top)

```
Layout:   horizontal, full-width, sticky top
Height:   56px
Background: --color-bg-secondary with backdrop-blur: 12px
Border-bottom: --border-subtle
Z-index:  100

Left:     [Logo wordmark "CurrentAI"] — --text-heading-2, --color-accent-primary
Center:   Nav links (desktop only) — Dashboard | Categories | Bookmarks
Right:    [Search icon] [Notification bell] [Avatar / account]

Mobile:   Hamburger menu icon on right, logo on left, no center links
Active nav link: --color-text-primary + 2px bottom border in --color-accent-primary
Inactive nav link: --color-text-secondary
```

### 8.8 Filter / Tab Bar

```
Used on: S3 (Category Filter), S4 (CMS Dashboard)

- Tabs are pill-shaped: radius --radius-full
- Active tab: background --color-accent-primary, text --color-text-inverse
- Inactive tab: background transparent, text --color-text-secondary
- Hover inactive: background --color-bg-tertiary
- Gap between tabs: --space-2
- Tab font: --text-body-sm, weight 500
- Container border-bottom: --border-subtle
- Sticky: position sticky, top 56px (below navbar)
```

### 8.9 Divider

```
Horizontal: border-top: --border-subtle, margin: --space-6 0
Section:    border-top: --border-default, margin: --space-8 0
```

### 8.10 Toast / Notification

```
Position:  bottom-right, 16px from edges
Width:     360px max (mobile: full width minus 32px margin)
Radius:    --radius-lg
Padding:   --space-4 --space-5
Shadow:    --shadow-lg

Success: border-left 3px solid --color-success
Error:   border-left 3px solid --color-danger
Info:    border-left 3px solid --color-accent-primary

Auto-dismiss: 4 seconds
Show close (×) button always
```

### 8.11 Modal / Dialog

```
Backdrop:  rgba(0,0,0,0.7), backdrop-filter: blur(4px)
Container: --color-bg-secondary, --radius-xl, --shadow-lg
Width:     480px (desktop) / 92vw (mobile)
Padding:   --space-8
Header:    --text-heading-2 + close (×) icon top-right
Footer:    right-aligned action buttons, gap --space-3
```

### 8.12 Empty State

```
Layout:    centered vertically and horizontally in container
Icon:      48px, --color-text-muted
Title:     --text-heading-3, --color-text-secondary
Body:      --text-body-sm, --color-text-muted, max 280px
CTA:       Primary button (optional)
Padding:   --space-16 vertically
```

### 8.13 Skeleton Loader

```
Used during data fetch for all cards and content areas.
- Background:  --color-bg-tertiary
- Shine:       animated gradient shimmer from left to right
  gradient: linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)
- Duration:    1.4s infinite
- Radius:      match the element being loaded
- Never show spinner for content list loads — always use skeletons
```

---

## 9. Screen-Specific Layout Specs

### S1 — Home / Daily Digest Feed

```
Structure:
┌─────────── NAVBAR (sticky) ────────────┐
├─────────── HERO STRIP ─────────────────┤
│  "Today's Digest — April 24, 2026"     │  ← --text-heading-1, date auto-updated
│  [X articles · Last updated HH:MM]     │  ← --text-caption
├─────────── FILTER TAB BAR (sticky) ────┤
│  All | Politics | Economy | Technology │
├─────────── CARD GRID ──────────────────┤
│  [Card] [Card] [Card]                  │  ← 3-col desktop / 1-col mobile
│  [Card] [Card] [Card]                  │
│  [Load More button — ghost style]      │
└────────────────────────────────────────┘

Card grid gap: --space-6
Section top padding: --space-8
```

### S2 — Article Detail View

```
Structure:
┌─────────── NAVBAR ────────────────────┐
├─────────── BREADCRUMB ────────────────┤  ← "Home / Politics / Article Title"
├─────────── ARTICLE HEADER ───────────┤
│  [CATEGORY CHIP]  [QA BADGE]          │
│  Article Headline                     │  ← --text-display
│  [Source logo] Source · Date · Time   │  ← --text-caption
├─────────── ARTICLE BODY ─────────────┤
│  AI Summary (--font-serif, 18px,      │  ← max-width 720px, centered
│  line-height 1.8)                     │
├─────────── SOURCE ATTRIBUTION ────────┤
│  "Based on reporting by [Source]"     │
│  [Read original article →]            │  ← primary button
├─────────── RELATED ARTICLES ──────────┤
│  [Card] [Card] [Card]                 │  ← horizontal scroll on mobile
└────────────────────────────────────────┘
```

### S3 — Category / Filter View

```
Layout:
- Full-width sticky filter bar with category tabs
- Below: same 3-column card grid as S1
- Left sidebar (desktop only, 240px): date range picker + source filter checkboxes
- Main content: 9-col card grid when sidebar present
- Active filter chips shown above grid: [Politics ×] [Last 7 days ×] [Clear all]
```

### S4 — CMS Editorial Dashboard (Admin)

```
Layout: Two-panel split
Left panel (400px, fixed): List of content items
  - Each row: headline (clamped 1 line) + category chip + QA badge + timestamp
  - Selected item: highlighted with --color-bg-tertiary + left accent border
  - Filter tabs: All | Pending Review | Flagged | Published | Quarantined

Right panel (flex remaining): Detail view of selected item
  - Full summary text
  - QA result details (confidence score, issues flagged)
  - Source URL
  - Action buttons: [Approve & Publish] [Reject] [Edit Summary]
  - Version history collapsible section
```

### S5 — n8n Workflow Monitor (Admin)

```
Layout:
- Stats row at top: 4 metric cards (Last Run, Articles Today, Flagged Count, Token Usage)
- Pipeline run table: sortable columns — Run ID | Trigger Time | Status | Articles | Errors | Duration
- Status badges: running (blue pulse) / completed / failed / partial
- Error log drawer: slides in from right on row click
- Refresh button top-right: auto-refresh every 60s toggle
```

### S6 — Subscription / Pricing Page

```
Layout:
- Hero section: headline + subline + trust badges ("Fact-checked", "No ads", "Source-attributed")
- Pricing cards: side-by-side (desktop) / stacked (mobile)
  Basic ($15/mo) — left card
  Pro ($30/mo) — right card, highlighted with --color-accent-primary border + "Most Popular" badge
- Feature comparison table below cards
- FAQ accordion section
- CTA strip at bottom: "Start free trial — no credit card required"
```

### S7 — Login / Account Screen

```
Layout: Centered card, max 400px
- Logo at top, centered
- Toggle: [Reader Login] [Admin Login]  ← pill toggle
- Email input
- Password input (with show/hide toggle)
- [Sign In] primary button, full width
- "Forgot password?" link, right-aligned, --text-body-sm
- Divider with "or"
- SSO options if available
- No sign-up link visible (invite-only or separate flow)

Card: --color-bg-secondary, --radius-xl, --shadow-lg
Page background: --color-bg-primary with subtle radial gradient behind card
```

---

## 10. Motion & Animation

| Purpose | Duration | Easing |
|---|---|---|
| Micro interactions (hover, focus) | 150ms | ease |
| Page transitions | 250ms | ease-in-out |
| Modal open/close | 200ms | ease-out |
| Toast slide-in | 250ms | cubic-bezier(0.16, 1, 0.3, 1) |
| Skeleton shimmer | 1400ms | linear, infinite |
| Accordion expand | 200ms | ease-in-out |

**Rules:**
- Never animate opacity and layout simultaneously on mobile
- Respect `prefers-reduced-motion` — all animations should fall back to instant when set
- No bounce or spring animations in editorial UI — keep motion purposeful and calm

---

## 11. Iconography

- **Icon library:** Lucide Icons (already available in Antigravity)
- **Default size:** 16px (inline), 20px (standalone/nav), 24px (section headers), 48px (empty states)
- **Color:** Always inherit from context (`currentColor`) — never hardcode icon colors
- **Stroke width:** 1.5px (Lucide default — do not change)
- **Never use filled icons** — stroke-only only throughout the product

**Key icons by context:**

| Context | Icon Name (Lucide) |
|---|---|
| Search | `Search` |
| Category: Politics | `Landmark` |
| Category: Economy | `TrendingUp` |
| Category: Science | `FlaskConical` |
| Category: Technology | `Cpu` |
| Category: World | `Globe` |
| Category: Health | `HeartPulse` |
| QA: Passed | `ShieldCheck` |
| QA: Flagged | `AlertTriangle` |
| QA: Quarantined | `ShieldX` |
| Source link | `ExternalLink` |
| Bookmark | `Bookmark` |
| Notifications | `Bell` |
| Settings | `Settings` |
| Logout | `LogOut` |
| Close | `X` |
| Filter | `SlidersHorizontal` |
| Refresh | `RefreshCw` |

---

## 12. Responsive Behavior

| Element | Mobile (< 640px) | Tablet (640–1024px) | Desktop (> 1024px) |
|---|---|---|---|
| Digest Card Grid | 1 column | 2 columns | 3 columns |
| Navbar | Logo + hamburger | Logo + hamburger | Full links |
| Article Detail | Full width, no sidebar | Full width | Centered, 720px max |
| Filter Tabs | Horizontally scrollable | Full width | Full width |
| CMS Dashboard | Full-screen list → full-screen detail | Two-panel split | Two-panel split |
| Pricing Cards | Stacked | Side-by-side | Side-by-side |
| Login Card | Full width, 16px margin | 400px centered | 400px centered |

---

## 13. Accessibility

- All interactive elements must have `focus-visible` styles using `--shadow-accent`
- Minimum touch target size: 44×44px on mobile
- Color contrast: all text on background must meet WCAG AA (4.5:1 for body, 3:1 for large text)
- All images and icons used functionally must have `aria-label` or `aria-hidden` as appropriate
- Form inputs must have associated `<label>` elements — never use placeholder as the only label
- QA status badges must not rely on color alone — always include the text label
- Category chips must not rely on color alone — always show the category name text

---

## 14. Do's and Don'ts

### ✅ DO
- Use skeleton loaders for all async content
- Show source attribution on every digest card and detail view
- Use the QA status badge consistently on all content items
- Keep the layout breathable — err toward more whitespace
- Truncate long text with CSS `line-clamp` rather than JavaScript
- Use `--font-serif` for article body only

### ❌ DON'T
- Add any advertisement slots, banners, or promotional content in the UI
- Use any color not in this design system
- Use font sizes outside the type scale
- Add animations on page load that delay content visibility
- Use modals for simple confirmations — use inline states where possible
- Show raw JSON or system error messages to end users — always show a friendly error state

---

*Design System Version: 1.0 | Product: CurrentAI | For use with Antigravity Agent build*
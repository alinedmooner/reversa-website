# ds — vanilla CSS design system

A self-contained, dependency-free design system. Dark-native, data-dense, quiet. One `<link>` and you have tokens, base styles, components, motion, and utilities.

```html
<link rel="stylesheet" href="ds/ds.css">
```

No build step. No JavaScript. No external requests (fonts ship in `fonts/`).

---

## Architecture

```
ds/
├── ds.css              ← import THIS (entry point, defines layer order)
├── css/
│   ├── fonts.css       — @font-face (Inter + Spectral-as-Tiempos)
│   ├── reset.css       — minimal modern reset            @layer reset
│   ├── tokens.css      — design tokens, vars only        @layer tokens
│   ├── base.css        — element baseline (h1, p, a…)    @layer base
│   ├── components.css  — .btn, .card, .badge, .table…    @layer components
│   ├── motion.css      — durations, easings, .m-* utils  @layer motion
│   └── utilities.css   — .display, .eyebrow, .tabular…   @layer utilities
├── fonts/              — Inter (variable) + Spectral (full family)
└── example.html        — kitchen-sink demo, zero JS
```

**Cascade layers.** Everything ships inside `@layer`, lowest-priority first. Your own CSS — written outside any layer — always wins. Override anything without specificity hacks or `!important`:

```css
/* your-app.css — beats the system automatically */
.btn--primary { border-radius: 999px; }
```

**Tokens are the API.** Re-theme by overriding custom properties, nothing else:

```css
:root {
  --color-accent: #2a6fdb;          /* swap the brand accent */
  --font-family-serif: "Lora", serif;
  --radius-lg: 14px;
}
```

---

## Quick reference

### Color
| Token | Value | Use |
|---|---|---|
| `--color-background` | `#0d0d0f` | universal canvas (never pure black) |
| `--color-surface` | `#1a1a1c` | cards, panels |
| `--color-surface-raised` | `#222229` | popovers, command bars |
| `--color-border` / `-subtle` | `#282828` / `#1f1f23` | hairline structure |
| `--color-text-primary` | `#ebebeb` | body (off-white, not #fff) |
| `--color-text-bright` | `#ffffff` | emphasis only |
| `--color-text-secondary` | `#7a7a7f` | descriptions |
| `--color-accent` | `#e8264a` | ONE accent moment per page |
| `--color-positive` / `--color-negative` | `#3fb37f` / `#d94b3f` | gains / losses |

Shorthand aliases for prototyping: `--fg1 --fg2 --fg3 --fg-bright --bg1 --bg2 --bg3 --line --line-soft --accent --gain --loss`.

### Type
- **Sans** (`--font-family-sans`, Inter) — 95% of UI. Weights 400/500/600 only.
- **Serif** (`--font-family-serif`, Spectral aliased as `"Tiempos"`) — editorial display moments via `.display`, `.display-lg`, `.display-xl`. Never body copy.
- **Mono** — ticker symbols, commands, code.
- Sizes are rem-based tokens mapping to an 11/12/13/14/16/22/30/36/48/64 px scale.
- Always `font-variant-numeric: tabular-nums` on data — `.tabular`, `.table` and `.badge` apply it for you.

### Spacing, radius, elevation
- 4px base unit: `--space-1` (4) → `--space-12` (48). `--space-4` (16) is the workhorse.
- Radius ladder: `--radius-xs` 4 → `--radius-3xl` 24, `--radius-full` for pills. `--radius-lg` (10px) is the house radius.
- Shadows `--shadow-sm/md/lg`. Most surfaces have NO shadow — hairline borders carry structure.
- Z-index scale: `--z-sticky` 10 → `--z-toast` 50.

### Components
`.btn` (`--primary --secondary --ghost --text --danger --icon --pill --sm`) · `.input` (`--search`) · `.field` (`__label __help __error`) · `.card` (`--flat --raised --floating`, `__header __title __subtitle`) · `.nav` (`--floating-dock --sidebar`, `__item`, `__item--active`) · `.tabs` + `.tab` (`--active`) · `.badge` (`--positive --negative --neutral --warning --pill`) · `.table` (`--dense`) · `.modal` (`--command-palette`, `__backdrop`) · `.toast` · `.avatar` (`--sm --lg --xl --square`) · `.divider`

### Motion
Tokens: `--dur-1…5` (80→600ms, default `--dur-2` 160ms), easings `--ease-out / --ease-in-out / --ease-emph`. Apply `transition: var(--t-base)` to any interactive element.

Utilities: `.m-fade-in .m-pop-in .m-slide-up .m-slide-down .m-flash-up .m-flash-down .m-shimmer-loop .m-spinner-loop .m-caret-loop .m-dot .m-draw .m-stagger`. All honor `prefers-reduced-motion`.

Rules: state changes move color/fill/border, never position or scale (modal entry's 2% scale is the only exception). Numbers never tween — flash the row, snap the value.

### Utilities
`.display .display-lg .display-xl .lead .caption .eyebrow .tabular .delta-up .delta-down .muted .bright .sans .serif .mono .visually-hidden`

---

## Design rules (the taste layer)

1. **Quiet by default.** One accent moment per screen. Most surfaces are flat with hairline borders.
2. **Off-white, not white.** `#fff` is reserved for emphasis — key numbers, active states.
3. **No left-border accent stripes.** State = fill tint, badge, or icon.
4. **Hover never moves things.** Fill shifts up one surface tier; text brightens.
5. **Two serif moments per page, max.** The serif is display-only.
6. **Tabular numbers everywhere** data appears.
7. **Sentence case everywhere.** No exclamation marks. No emoji.

## Accessibility baked in

- `:focus-visible` rings (keyboard-only), `--color-focus-ring` token
- `prefers-reduced-motion` collapses all animation
- `color-scheme: dark` so UA widgets render dark
- `.visually-hidden` helper for screen-reader-only text
- Reset preserves list semantics (`role="list"` opt-out pattern)

## Font licensing note

Display serif is **Spectral** (OFL, free) served under the family name `"Tiempos"`. If you license real Tiempos, drop the files into `fonts/` and update `css/fonts.css` — nothing else changes.

## Browser support

Modern evergreen browsers. Uses cascade layers (`@layer`), `:focus-visible`, logical properties, `clip-path`, `backdrop-filter` — all baseline since ~2022. No IE11.

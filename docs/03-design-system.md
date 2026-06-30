# 03 — Design System & Tokens

**Last updated:** 2026-06-30 · **Revision:** v3 — Japanese-minimalist spatial aesthetic, Western language structure
This document defines the visual language: the concept, the named tokens, and how they're implemented. The prototype (`prototype.html`) is a faithful render of everything below.

---

## 1. The concept — 余白 / Yohaku (spatial minimalism)

*Yohaku* (余白) is the Japanese term for the intentional blank space left in a composition — the same idea as *ma* (間), the active interval between things. This portfolio is built around it: the emptiness is the design. For an engineer whose whole pitch is *usability and clean architecture*, a layout governed by restraint, precision, and breathing room says more than any amount of decoration.

The design draws on the refined minimalist tradition (the Kenya Hara / MUJI / Zen-typeface lineage). Its principles:

- **間 Ma / 余白 Yohaku** — negative space is composed deliberately; content sits in generous air.
- **簡素 Kanso** — eliminate the non-essential. No gradients, no shadows-for-show, no decoration that isn't structural.
- **渋い Shibui** — understated elegance. Quiet motion, hairline rules, one restrained accent.
- **不均斉 Fukinsei** — balance through asymmetry rather than centered symmetry.

This is a **spatial and visual** aesthetic, not a textual one. The layout, spacing, typography choices, and the single accent element express the philosophy — not Japanese text on the page (which would be ornamental on a Western-language site and risk looking like a costume rather than a conviction).

### The signature — 判子 / the hanko seal
The one memorable element is a **vermilion hanko seal** (判子) — the personal seal used in Japan to sign and approve. It *is* a signature: a mark of authorship and "I stand behind this." The seal carries **カ** (the katakana initial of *Caio* → カイオ). This is the **only non-Latin character on the site**; it functions as a logo mark, not cultural decoration. On load it **stamps** onto the page (a quick press-and-settle), echoing ink meeting paper — the only assertive motion on the site. Boldness is spent here and nowhere else.

### Hero section — two columns
The introduction uses a two-column layout: text on the left (~60%), profile photo on the right (~40%). This gives the text room to breathe in natural LTR flow while using the right column as structured negative space (yohaku) before the photo is placed. The seal stamps above the h1.

On mobile: single column, photo first (face-to-name recognition before reading).

### Section structure
Each section is identified by an `.eyebrow` label — JetBrains Mono, uppercase, tracked, `--ink-faint` — sitting above the heading. Horizontal, English only. No sidebar decorations.

### Avoiding the generic AI look (deliberate choices)
The three AI defaults are (1) cream + high-contrast serif + terracotta, (2) near-black + bright vermilion/acid-green, (3) broadsheet hairlines + dense columns. Differentiation:
- The paper is a cool **washi off-white** (not warm cream); the serif is a **Japanese mincho** used for Latin headings (not a fashion serif); the accent is an **earthy vermilion used as a sparing hanko seal** (not terracotta, not a glowing accent).
- Dark mode is a **warm sumi charcoal with a brown undertone** (not near-black), and vermilion stays earthy — never neon.
- Hairlines are present, but paired with **expansive ma and asymmetry** — the opposite of dense newspaper columns.
- The hanko seal, yohaku spacing, and token-driven design are the defining devices.

### Typography — Zen lineage
- **Display — Zen Old Mincho.** A contemporary *mincho* (serif) by Yoshimichi Ohira; carries Latin beautifully with its structured strokes. Sets the editorial, crafted tone.
- **Body — Zen Kaku Gothic New.** A clean modern *gothic* (sans) from the same family; highly legible — legibility-first, which is the brand.
- **Mono / utility — JetBrains Mono.** Section eyebrows, dates, code, data. The engineer's voice.

(All open-source, on Google Fonts. Self-host subset `woff2` in production.)

---

## 2. Color tokens

Authored in **OKLCH**, shipped as CSS custom properties. Near-monochrome (washi ↔ sumi) with a single earthy vermilion (朱 *shu*) and a deep indigo (藍 *ai*) used very sparingly. Hex values approximate.

### Light theme — "紙 / Washi"
| Token | OKLCH | ≈ Hex | Role |
|---|---|---|---|
| `--paper` | `oklch(0.972 0.005 85)` | `#f5f3ed` | page (washi off-white) |
| `--surface` | `oklch(0.990 0.003 85)` | `#fcfbf7` | raised |
| `--surface-sunk` | `oklch(0.950 0.006 80)` | `#ece8df` | wells / code |
| `--ink` | `oklch(0.26 0.012 60)` | `#2b2620` | primary text (sumi) |
| `--ink-muted` | `oklch(0.50 0.012 60)` | `#6d665b` | secondary text |
| `--ink-faint` | `oklch(0.66 0.010 60)` | `#9b9389` | captions |
| `--line` | `oklch(0.88 0.006 70)` | `#ddd9d0` | hairlines |
| `--shu` | `oklch(0.585 0.165 36)` | `#c8553a` | seal / accent |
| `--shu-strong` | `oklch(0.52 0.17 36)` | `#b1452d` | accent text / hover (AA-safe) |
| `--shu-soft` | `oklch(0.94 0.04 36)` | `#f6e6df` | accent wash |
| `--ai` | `oklch(0.42 0.09 252)` | `#41566f` | rare secondary (indigo) |
| `--on-shu` | `oklch(0.99 0.005 85)` | `#fdfdf9` | text on seal |

### Dark theme — "墨 / Sumi" (warm charcoal, not black)
| Token | OKLCH | ≈ Hex | Role |
|---|---|---|---|
| `--paper` | `oklch(0.235 0.012 55)` | `#28231c` | page (sumi charcoal) |
| `--surface` | `oklch(0.275 0.012 55)` | `#322c24` | raised |
| `--surface-sunk` | `oklch(0.205 0.010 55)` | `#221e18` | wells / code |
| `--ink` | `oklch(0.92 0.012 80)` | `#ece6da` | primary text |
| `--ink-muted` | `oklch(0.70 0.012 70)` | `#a9a194` | secondary text |
| `--ink-faint` | `oklch(0.55 0.012 60)` | `#7d756a` | captions |
| `--line` | `oklch(0.36 0.012 55)` | `#463f35` | hairlines |
| `--shu` | `oklch(0.66 0.15 38)` | `#db6f4f` | seal / accent |
| `--shu-strong` | `oklch(0.72 0.14 38)` | `#e7866a` | accent text / hover |
| `--shu-soft` | `oklch(0.32 0.06 36)` | `#45302a` | accent wash |
| `--ai` | `oklch(0.62 0.10 250)` | `#7088a8` | rare secondary |
| `--on-shu` | `oklch(0.18 0.01 55)` | `#1d1913` | text on seal |

### Contrast (WCAG 2.2)
- `--ink` on `--paper`: ≥ 12:1 (AAA) — both themes.
- `--ink-muted` on `--paper`: ≥ 4.5:1 (AA). Don't use `--ink-faint` for essential text.
- **Text links use `--shu-strong`, not `--shu`** (vermilion at `--shu` is borderline for small text on washi). Better still: ink text + an animated `--shu` hairline underline (decorative red, high-contrast text).
- `--on-shu` on `--shu`: ≥ 4.5:1.

---

## 3. Typography tokens

Fluid scale (`clamp`), restrained ratio (~1.2 → ~1.26). Mincho headings are set a touch larger and looser to let the serif breathe.

| Token | Value | Use |
|---|---|---|
| `--font-display` | `"Zen Old Mincho", Georgia, serif` | headings, hero |
| `--font-body` | `"Zen Kaku Gothic New", system-ui, sans-serif` | prose, UI |
| `--font-mono` | `"JetBrains Mono", ui-monospace, monospace` | eyebrows, dates, code |
| `--step--1` | `clamp(0.80rem, 0.76rem + 0.18vw, 0.92rem)` | captions / mono labels |
| `--step-0` | `clamp(1rem, 0.95rem + 0.25vw, 1.10rem)` | body |
| `--step-1` | `clamp(1.18rem, 1.10rem + 0.40vw, 1.40rem)` | lead |
| `--step-2` | `clamp(1.42rem, 1.28rem + 0.60vw, 1.75rem)` | h3 |
| `--step-3` | `clamp(1.70rem, 1.48rem + 0.95vw, 2.25rem)` | h2 |
| `--step-4` | `clamp(2.05rem, 1.70rem + 1.5vw, 2.95rem)` | h1 |
| `--step-5` | `clamp(2.5rem, 1.95rem + 2.4vw, 4.0rem)` | hero |

Weights: mincho **400/700**; gothic **400/500/700**; mono **400/500**. Line-height: headings `1.18` (mincho needs room), body `1.7` (generous, *ma* in the text too). Tracking: mono eyebrows `+0.16em` uppercase.

---

## 4. Space, radius, layout

**Spacing scale (4px base), used generously:**
`--space-1:4 · 2:8 · 3:12 · 4:16 · 5:24 · 6:32 · 7:48 · 8:64 · 9:96 · 10:128 · 11:192` (px)
Section vertical rhythm leans on `--space-10`/`--space-11` — yohaku is built from large intervals.

**Radius:** mostly **0** (hairlines, squared edges). Exceptions: the **hanko seal** (`--radius-seal: 8px`, a carved-stone rounding) and small interactive controls (`--radius-1: 4px`). Restraint over rounding.

**Layout:**
- Page max-width `~1180px`, `padding-inline: clamp(22px, 5vw, 56px)`.
- Prose measure `~64ch`.
- **Hero:** two-column grid — `1fr clamp(200px, 28vw, 320px)`. Left column: seal + eyebrow, h1, lead paragraph, CTAs, skill chips. Right column: square profile photo (1px `--line` border, `--surface-sunk` fill until the photo is provided). The empty photo slot is intentional yohaku. The seal marks the bottom-right corner of the photo frame.
- **Content sections:** full-width within the wrap. No sidebar gutter. Section identity comes from the `.eyebrow` label above each heading. Prose blocks are max-width constrained (~64ch) to preserve reading measure and leave natural margin.
- Mobile: single column throughout; hero photo precedes text (face-to-name before reading).

---

## 5. Motion tokens (shibui — quiet)

| Token | Value |
|---|---|
| `--dur-1` | `140ms` (hover) |
| `--dur-2` | `260ms` (entrances) |
| `--dur-stamp` | `420ms` (the seal press) |
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| `--ease-stamp` | `cubic-bezier(0.34, 1.4, 0.5, 1)` (slight overshoot — the press) |

The seal stamps in once. Content fades up gently with stagger. Link underlines draw in on hover. Everything else is still. **All motion wrapped in `@media (prefers-reduced-motion: no-preference)`**; reduced-motion users get static final states (the seal simply appears).

---

## 6. Components

Primitives, states derived from tokens:
- **Seal** — the hanko mark; logo + active indicator. Squared-rounded (`--radius-seal`), vermilion, carries カ. The **only non-Latin character on the site**; functions as a logo mark.
- **Eyebrow** — section label. JetBrains Mono, uppercase, tracked, `--ink-faint`. Horizontal, English only. Sits above each section heading.
- **Link** — ink text, vermilion hairline underline that draws on hover/focus.
- **Text button** — minimal; a label with a leading/trailing hairline, not a filled blob (filled `--shu` button reserved for the single primary CTA).
- **Hairline card** — work/demo/post rows bordered by a single rule; hover reveals a thin `--shu` top-rule. No drop shadow.
- **Chip** — mono, hairline-bordered, for stack/tags; lead chip carries `--shu` border.
- **Timeline row** — dated (real chronological sequence), mincho role, hairline divider.
- **Prose** — article body; code on `--surface-sunk`, generous leading.
- **Photo slot** — hero right column: square, 1px `--line` border, `--surface-sunk` fill. Replaced by the real photo; at rest the empty slot is its own yohaku. The seal marks the bottom-right corner.

**Focus:** 2px `--shu` ring, 2px offset, always visible. **Targets:** ≥ 44px.

---

## 7. Implementation — `global.css` (Tailwind v4, CSS-first)

```css
@import "tailwindcss";

@theme {
  --font-display: "Zen Old Mincho", Georgia, serif;
  --font-body: "Zen Kaku Gothic New", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
  --radius-seal: 8px;
  --radius-1: 4px;
}

:root, [data-theme="light"]{
  --paper: oklch(0.972 0.005 85);
  --surface: oklch(0.990 0.003 85);
  --surface-sunk: oklch(0.950 0.006 80);
  --ink: oklch(0.26 0.012 60);
  --ink-muted: oklch(0.50 0.012 60);
  --ink-faint: oklch(0.66 0.010 60);
  --line: oklch(0.88 0.006 70);
  --shu: oklch(0.585 0.165 36);
  --shu-strong: oklch(0.52 0.17 36);
  --shu-soft: oklch(0.94 0.04 36);
  --ai: oklch(0.42 0.09 252);
  --on-shu: oklch(0.99 0.005 85);
  color-scheme: light;
}
[data-theme="dark"]{
  --paper: oklch(0.235 0.012 55);
  --surface: oklch(0.275 0.012 55);
  --surface-sunk: oklch(0.205 0.010 55);
  --ink: oklch(0.92 0.012 80);
  --ink-muted: oklch(0.70 0.012 70);
  --ink-faint: oklch(0.55 0.012 60);
  --line: oklch(0.36 0.012 55);
  --shu: oklch(0.66 0.15 38);
  --shu-strong: oklch(0.72 0.14 38);
  --shu-soft: oklch(0.32 0.06 36);
  --ai: oklch(0.62 0.10 250);
  --on-shu: oklch(0.18 0.01 55);
  color-scheme: dark;
}

body{ background:var(--paper); color:var(--ink); font-family:var(--font-body); line-height:1.7; }
h1,h2,h3{ font-family:var(--font-display); line-height:1.18; }

/* section eyebrow label */
.eyebrow{
  font-family: var(--font-mono);
  font-size: .72rem;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: var(--ink-faint);
}

/* the seal stamps in once */
@media (prefers-reduced-motion: no-preference){
  .seal.stamp{ animation: stamp var(--dur-stamp) var(--ease-stamp) both; }
  @keyframes stamp{
    0%{ opacity:0; transform: scale(1.18) rotate(-4deg); }
    100%{ opacity:1; transform: none; }
  }
}

/* link underline draws on hover */
.link{ color:var(--ink); text-decoration:none; background-image:linear-gradient(var(--shu),var(--shu));
  background-size:0% 1px; background-position:0 100%; background-repeat:no-repeat;
  transition: background-size var(--dur-1) var(--ease-out); }
.link:hover, .link:focus-visible{ background-size:100% 1px; }
@media (prefers-reduced-motion: reduce){ .link{ background-size:100% 1px; } }
```

> **CSS pitfall to avoid:** don't let a type-selector (`section`) and a class (`.band`) both set section padding — they fight over specificity and quietly cancel. Keep section spacing on one named class.

---

## 8. Accessibility & quality floor (non-negotiable)
- AA contrast on every text token pair (text links use `--shu-strong` or ink-with-underline).
- Visible `--shu` keyboard focus everywhere; skip-to-content link; logical heading order.
- The seal carries `aria-label="Caio"` on its first (brand logo) occurrence; all subsequent instances are `aria-hidden="true"`.
- `prefers-reduced-motion` respected (seal appears, no stamp); `prefers-color-scheme` honored on first paint (no flash).
- Hit areas ≥ 44px; forms have real labels and specific inline errors.

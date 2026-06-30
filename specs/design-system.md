# Spec: Design System

Implements the Yohaku visual language as CSS custom properties, Tailwind v4 theme, and reusable primitive components. Everything downstream imports from here — never hard-code a color or font.

## Files

```
src/styles/global.css
src/components/Seal.astro
src/components/ThemeToggle.astro
src/components/Eyebrow.astro      (optional thin wrapper)
```

## `src/styles/global.css`

```css
@import "tailwindcss";

@theme {
  --font-display: "Zen Old Mincho", Georgia, serif;
  --font-body:    "Zen Kaku Gothic New", system-ui, sans-serif;
  --font-mono:    "JetBrains Mono", ui-monospace, monospace;
  --radius-seal:  8px;
  --radius-1:     4px;
  /* motion */
  --dur-1:        140ms;
  --dur-2:        260ms;
  --dur-stamp:    420ms;
  --ease-out:     cubic-bezier(0.22, 1, 0.36, 1);
  --ease-stamp:   cubic-bezier(0.34, 1.4, 0.5, 1);
}

/* ── Light: Washi ── */
:root, [data-theme="light"] {
  --paper:        oklch(0.972 0.005 85);
  --surface:      oklch(0.990 0.003 85);
  --surface-sunk: oklch(0.950 0.006 80);
  --ink:          oklch(0.26  0.012 60);
  --ink-muted:    oklch(0.50  0.012 60);
  --ink-faint:    oklch(0.66  0.010 60);
  --line:         oklch(0.88  0.006 70);
  --shu:          oklch(0.585 0.165 36);
  --shu-strong:   oklch(0.52  0.17  36);
  --shu-soft:     oklch(0.94  0.04  36);
  --ai:           oklch(0.42  0.09 252);
  --on-shu:       oklch(0.99  0.005 85);
  color-scheme: light;
}

/* ── Dark: Sumi ── */
[data-theme="dark"] {
  --paper:        oklch(0.235 0.012 55);
  --surface:      oklch(0.275 0.012 55);
  --surface-sunk: oklch(0.205 0.010 55);
  --ink:          oklch(0.92  0.012 80);
  --ink-muted:    oklch(0.70  0.012 70);
  --ink-faint:    oklch(0.55  0.012 60);
  --line:         oklch(0.36  0.012 55);
  --shu:          oklch(0.66  0.15  38);
  --shu-strong:   oklch(0.72  0.14  38);
  --shu-soft:     oklch(0.32  0.06  36);
  --ai:           oklch(0.62  0.10 250);
  --on-shu:       oklch(0.18  0.01  55);
  color-scheme: dark;
}

/* ── Base ── */
body {
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font-body);
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
}
h1, h2, h3 { font-family: var(--font-display); line-height: 1.18; }
::selection { background: color-mix(in oklch, var(--shu) 26%, transparent); }

/* ── Eyebrow label ── */
.eyebrow {
  font-family: var(--font-mono);
  font-size: .72rem;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: var(--ink-faint);
}

/* ── Animated link underline ── */
.link {
  color: var(--ink);
  text-decoration: none;
  background-image: linear-gradient(var(--shu), var(--shu));
  background-size: 0% 1px;
  background-position: 0 100%;
  background-repeat: no-repeat;
  transition: background-size var(--dur-1) var(--ease-out);
}
.link:hover, .link:focus-visible { background-size: 100% 1px; }
@media (prefers-reduced-motion: reduce) { .link { background-size: 100% 1px; } }

/* ── Focus ── */
:where(a, button, input, [tabindex]):focus-visible {
  outline: 2px solid var(--shu);
  outline-offset: 3px;
}

/* ── Seal stamp animation ── */
@media (prefers-reduced-motion: no-preference) {
  .seal-stamp {
    animation: seal-stamp var(--dur-stamp) var(--ease-stamp) both;
  }
  @keyframes seal-stamp {
    0%   { opacity: 0; transform: scale(1.18) rotate(-4deg); }
    100% { opacity: 1; transform: none; }
  }
}

/* ── Entrance fade ── */
@media (prefers-reduced-motion: no-preference) {
  .fade-up {
    opacity: 0;
    transform: translateY(12px);
    animation: fade-up var(--dur-2) var(--ease-out) forwards;
  }
  .delay-1 { animation-delay: 100ms; }
  .delay-2 { animation-delay: 220ms; }
  .delay-3 { animation-delay: 340ms; }
  @keyframes fade-up { to { opacity: 1; transform: none; } }
}

/* ── Chip ── */
.chip {
  font-family: var(--font-mono);
  font-size: .72rem;
  color: var(--ink-muted);
  border: 1px solid var(--line);
  border-radius: 9999px;
  padding: .32rem .8rem;
}
.chip-lead { border-color: var(--shu); color: var(--shu-strong); }

/* ── Button ── */
.btn {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: .92rem;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: .6rem;
  padding: .65rem 1.25rem;
  border: 1px solid var(--ink);
  color: var(--ink);
  border-radius: var(--radius-1);
  transition: background var(--dur-1), color var(--dur-1);
}
.btn:hover { background: var(--ink); color: var(--paper); }
.btn-fill  { background: var(--shu); border-color: var(--shu); color: var(--on-shu); }
.btn-fill:hover { background: var(--shu-strong); border-color: var(--shu-strong); }

/* ── Hairline card hover ── */
.hairline-card {
  position: relative;
  border: 1px solid var(--line);
  transition: background var(--dur-1);
}
.hairline-card::before {
  content: "";
  position: absolute;
  inset: 0 0 auto 0;
  height: 2px;
  background: var(--shu);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform .22s var(--ease-out);
}
.hairline-card:hover { background: var(--surface); }
.hairline-card:hover::before { transform: scaleX(1); }

/* ── Prose ── */
.prose {
  max-width: 68ch;
  color: var(--ink);
  line-height: 1.75;
}
.prose h2, .prose h3 { margin-top: 2.4rem; margin-bottom: .8rem; }
.prose p  { margin-top: 1.2rem; }
.prose code, .prose pre {
  font-family: var(--font-mono);
  background: var(--surface-sunk);
  border-radius: var(--radius-1);
}
.prose code { font-size: .88em; padding: .15em .4em; }
.prose pre  { padding: 1.2rem 1.4rem; overflow-x: auto; margin-top: 1.4rem; }
.prose a    { color: var(--shu-strong); }
```

## Typography fluid scale

Apply via Tailwind utilities or directly in components:

| Step | Value | Use |
|---|---|---|
| `-1` | `clamp(.80rem, .76rem + .18vw, .92rem)` | captions, mono labels |
| `0`  | `clamp(1rem, .95rem + .25vw, 1.10rem)` | body |
| `1`  | `clamp(1.18rem, 1.10rem + .40vw, 1.40rem)` | lead |
| `2`  | `clamp(1.42rem, 1.28rem + .60vw, 1.75rem)` | h3 |
| `3`  | `clamp(1.70rem, 1.48rem + .95vw, 2.25rem)` | h2 |
| `4`  | `clamp(2.05rem, 1.70rem + 1.5vw, 2.95rem)` | h1 |
| `5`  | `clamp(2.5rem, 1.95rem + 2.4vw, 4.0rem)` | hero h1 |

Add as `@theme` entries under `--text-*` if reaching from Tailwind utilities, or use `style="font-size: clamp(...)"` inline in components.

## `src/components/Seal.astro`

```astro
---
interface Props {
  size?: 'sm' | 'lg';
  label?: string;   // aria-label; omit → aria-hidden
  stamp?: boolean;  // plays stamp animation on mount
}
const { size = 'sm', label, stamp = false } = Astro.props;
const dim = size === 'lg' ? 'width:78px;height:78px;font-size:46px' : 'width:30px;height:30px;font-size:17px';
---
<span
  class:list={['seal', stamp && 'seal-stamp']}
  style={`display:inline-grid;place-items:center;background:var(--shu);color:var(--on-shu);font-family:var(--font-display);font-weight:700;border-radius:var(--radius-seal);line-height:1;box-shadow:inset 0 0 0 1.5px color-mix(in oklch,var(--on-shu) 22%,transparent);user-select:none;${dim}`}
  {...label ? { 'aria-label': label } : { 'aria-hidden': 'true' }}
>カ</span>
```

Usage:
```astro
<!-- Brand logo — named -->
<Seal size="lg" label="Caio" stamp />

<!-- Decorative repeat — hidden -->
<Seal size="sm" />
```

## `src/components/ThemeToggle.astro`

```astro
---
// No props — reads system preference on first paint, no flash.
---
<button
  id="theme-toggle"
  class="toggle"
  aria-pressed="false"
  style="cursor:pointer;background:transparent;border:1px solid var(--line);color:var(--ink-muted);border-radius:var(--radius-1);padding:.4rem .7rem;font-family:var(--font-mono);font-size:.72rem;"
>light / dark</button>

<script>
  const root = document.documentElement;
  const btn  = document.getElementById('theme-toggle') as HTMLButtonElement;

  function setTheme(t: string) {
    root.setAttribute('data-theme', t);
    btn.setAttribute('aria-pressed', String(t === 'dark'));
    localStorage.setItem('theme', t);
  }

  // First paint: stored → system → default light
  const stored = localStorage.getItem('theme');
  const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  setTheme(stored ?? system);

  btn.addEventListener('click', () =>
    setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark')
  );
</script>
```

## Web fonts

In `BaseLayout.astro` `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Zen+Old+Mincho:wght@400;700&family=Zen+Kaku+Gothic+New:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

Production: download woff2 subsets (Latin only), put in `public/fonts/`, replace Google link with `@font-face` blocks in `global.css`. Subset tool: `pyftsubset` or [google-webfonts-helper](https://gwfh.mranftl.com/).

## Contrast rules (enforce in code review)

- Body text: always `--ink` or `--ink-muted` on `--paper` → both ≥ AA.
- Links: `color: var(--shu-strong)` not `var(--shu)` — `--shu` is borderline on washi light.
- Preferred link pattern: `--ink` text + `.link` animated underline (vermilion is decorative, text stays high-contrast).
- `--ink-faint` for captions only; never for actionable text.

## Definition of done

- Both themes render with zero FOUC (ThemeToggle sets `data-theme` before first paint).
- Seal animates on mount; `prefers-reduced-motion` users see seal immediately without animation.
- All token pairs pass WCAG AA — verified by axe in Playwright.
- `npm run check` passes (no TypeScript errors in component props).

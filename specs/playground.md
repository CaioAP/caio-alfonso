# Spec: Playground

Registry-driven collection of live interactive demos. Each demo is an isolated island (Vue or React). Adding a demo = one folder + one registry entry.

## Files

```
src/features/playground/
  _registry.ts                    # single source of truth for all demos
  token-studio/
    TokenStudio.tsx               # React island
    index.ts                      # re-export
  color-contrast/
    ContrastChecker.vue           # Vue island
    index.ts
  command-palette/
    CommandPalette.vue            # Vue island
    index.ts
  states-quartet/
    StatesQuartet.vue             # Vue island
    index.ts

src/pages/playground/
  index.astro                     # demo grid
  [slug].astro                    # single demo, full-bleed
```

## `src/features/playground/_registry.ts`

```ts
export interface Demo {
  id:          string;         // matches folder name and URL slug
  title:       string;
  description: string;
  framework:   'Vue' | 'React' | 'Vue ↔ React';
  // dynamic import — Astro/Vite resolves at build time
  load:        () => Promise<{ default: unknown }>;
}

export const registry: Demo[] = [
  {
    id:          'token-studio',
    title:       'Design Token Studio',
    description: "Edit this site's tokens live; export the CSS.",
    framework:   'React',
    load:        () => import('./token-studio/TokenStudio'),
  },
  {
    id:          'color-contrast',
    title:       'Contrast & A11y Checker',
    description: 'Two colors → the WCAG verdict and a fix.',
    framework:   'Vue',
    load:        () => import('./color-contrast/ContrastChecker.vue'),
  },
  {
    id:          'command-palette',
    title:       'Command Palette ⌘K',
    description: 'Keyboard-first, fuzzy navigation.',
    framework:   'Vue',
    load:        () => import('./command-palette/CommandPalette.vue'),
  },
  {
    id:          'states-quartet',
    title:       'The States Quartet',
    description: 'Loading · empty · error · success, done right.',
    framework:   'Vue',
    load:        () => import('./states-quartet/StatesQuartet.vue'),
  },
];

export function getDemo(id: string): Demo | undefined {
  return registry.find(d => d.id === id);
}
```

## `src/pages/playground/index.astro`

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { registry } from '../../features/playground/_registry';
---
<BaseLayout title="Playground — Caio" description="Small, finished demos you can poke at.">
  <section class="band">
    <div class="wrap">
      <p class="eyebrow">Playground</p>
      <h1 class="h2lead">Small, finished things you can poke at.</h1>
      <p class="lede">Each is an isolated island — some Vue, some React — with a short note on how it's built.</p>
      <div class="demo-grid">
        {registry.map(demo => (
          <a class="demo-card hairline-card" href={`/playground/${demo.id}`}>
            <span class="fw">{demo.framework}</span>
            <h2>{demo.title}</h2>
            <p>{demo.description}</p>
            <span class="go">open →</span>
          </a>
        ))}
      </div>
    </div>
  </section>
</BaseLayout>

<style>
  .demo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(248px, 1fr));
    gap: 0;
    margin-top: 2.2rem;
    border-top: 1px solid var(--line);
    border-left: 1px solid var(--line);
  }
  .demo-card {
    border-right: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
    padding: 1.5rem;
    min-height: 178px;
    display: flex;
    flex-direction: column;
    gap: .5rem;
    text-decoration: none;
    color: inherit;
  }
  .fw { font-family: var(--font-mono); font-size: .64rem; letter-spacing: .1em; text-transform: uppercase; color: var(--ink-faint); }
  .demo-card h2 { font-size: 1.12rem; }
  .demo-card p  { margin: 0; color: var(--ink-muted); font-size: .88rem; }
  .go { margin-top: auto; font-family: var(--font-mono); font-size: .72rem; color: var(--shu-strong); }
</style>
```

## `src/pages/playground/[slug].astro`

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { registry, getDemo } from '../../features/playground/_registry';

export function getStaticPaths() {
  return registry.map(d => ({ params: { slug: d.id } }));
}

const { slug } = Astro.params;
const demo = getDemo(slug);
if (!demo) throw new Error(`Demo not found: ${slug}`);
---
<BaseLayout title={`${demo.title} — Playground — Caio`} description={demo.description}>
  <div class="demo-shell">
    <header class="demo-header wrap">
      <p class="eyebrow">{demo.framework}</p>
      <h1>{demo.title}</h1>
      <p class="lede">{demo.description}</p>
    </header>
    <div class="demo-stage" id="demo-stage">
      <!-- Island rendered below per demo -->
    </div>
  </div>
</BaseLayout>
```

Each demo page imports its island directly (simpler than dynamic island loading):

```astro
---
// In each demo's own page or via a switch in [slug].astro
---
{slug === 'token-studio'   && <TokenStudio   client:load />}
{slug === 'color-contrast' && <ContrastChecker client:load />}
{slug === 'command-palette' && <CommandPalette  client:load />}
{slug === 'states-quartet' && <StatesQuartet  client:load />}
```

Or use `client:only="react"` / `client:only="vue"` for demos that can't render server-side.

## Demo specs

### Token Studio (`token-studio/TokenStudio.tsx`) — React

Lets the user edit all `--shu`, `--paper`, `--ink` values and preview them live. Exports the changed CSS block.

Core state: `Record<string, string>` keyed by token name. On change: `document.documentElement.style.setProperty(name, value)`. Export: formats as a `[data-theme]` CSS block, copies to clipboard.

Key features:
- OKLCH sliders (L, C, H) per token
- Live preview of text contrast ratio (WCAG AA/AAA badge)
- "Copy CSS" button copies the modified `@theme` + `:root` block

### Contrast Checker (`color-contrast/ContrastChecker.vue`) — Vue

Two color pickers → computes WCAG contrast ratio → FAIL/AA/AAA badge → suggests a passing fix if failing.

Core logic: OKLCH → linear sRGB → relative luminance → contrast ratio. All pure TypeScript in `src/lib/color.ts`.

### Command Palette (`command-palette/CommandPalette.vue`) — Vue

`⌘K` opens a modal with a fuzzy search input. Demo data: a list of ~30 fake commands/pages. Uses `Fuse.js` for fuzzy search.

Key features:
- `⌘K` / `Ctrl+K` opens, `Esc` closes
- Arrow keys navigate, `Enter` selects
- Focus trap while open
- `aria-role="dialog"`, `aria-modal="true"`, `aria-label`
- Results grouped by type

### States Quartet (`states-quartet/StatesQuartet.vue`) — Vue

Single async data widget shown in 4 states: loading, empty, error, success. Toggle buttons let the visitor switch states manually.

Shows correct UX patterns:
- Loading: skeleton (not spinner-only)
- Empty: message + CTA, not just "no data"
- Error: human message + retry action
- Success: the data

## `src/lib/color.ts` — shared utility

```ts
/** OKLCH → sRGB → relative luminance → WCAG contrast ratio */
export function contrastRatio(l1: number, l2: number): number {
  const lum = (l: number) => l <= 0.04045 ? l / 12.92 : Math.pow((l + 0.055) / 1.055, 2.4);
  // For OKLCH: convert to linear sRGB luminance via perceptual lightness
  // Use CSS Color 4 formula or approximate: Y ≈ L^3
  const L1 = Math.max(l1, l2);
  const L2 = Math.min(l1, l2);
  return (L1 + 0.05) / (L2 + 0.05);
}

export function wcagRating(ratio: number): 'FAIL' | 'AA' | 'AAA' {
  if (ratio >= 7)   return 'AAA';
  if (ratio >= 4.5) return 'AA';
  return 'FAIL';
}
```

## Hydration strategy

| Demo | Client directive | Reason |
|---|---|---|
| Token Studio | `client:load` | must run immediately |
| Contrast Checker | `client:load` | interactive tool |
| Command Palette | `client:load` | keyboard shortcut must register |
| States Quartet | `client:visible` | below the fold on demo page |

## Definition of done

- `/playground` grid renders with zero JS (server-rendered cards).
- Each demo page loads its island; island works keyboard-only.
- All demos pass axe (focus trap in command palette, contrast checker passes its own check).
- Adding a 5th demo: create folder + add one entry to `_registry.ts` — no other file changes.
- `prefers-reduced-motion` respected in all demo animations.

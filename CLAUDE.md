# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Personal portfolio + daily frontend blog for Caio. **Built and deployed** — the site is live, serving real content from Sanity.

- **Live:** https://caio-alfonso.pages.dev (Cloudflare Pages, auto-deploys from `main`)
- **Studio:** https://caio-alfonso.sanity.studio
- **Sanity:** project `ftpb674o`, dataset `production` (private)

Publishing in the Studio fires a webhook that rebuilds Pages — no code change needed to ship content.

`docs/` holds the original planning material and remains the reference for *intent* (goals, ADRs, design tokens, backlog). Where a doc and the code disagree, the code is what ships — `docs/06-progress-checklist.md` tracks the live state.

| Doc | Contents |
|---|---|
| `docs/00-project-spec.md` | Goals, IA, functional requirements, quality floor |
| `docs/01-architecture-decisions.md` | ADRs (framework, CMS, hosting, styling, rendering, repo structure) |
| `docs/02-stack-and-services.md` | Full stack, Sanity content schemas, publish pipeline, cost breakdown |
| `docs/03-design-system.md` | Design tokens, typography, `global.css`, a11y rules |
| `docs/04-showcase-and-blog-backlog.md` | Playground demo ideas + blog topic backlog |
| `docs/05-delivery-roadmap.md` | Phased plan and definitions of done |
| `docs/06-progress-checklist.md` | **Current state — what is done and what is left** |
| `specs/` | Per-feature implementation specs, kept in sync with the code |

## Locked decisions

- **Framework:** Astro 7 shell with Vue 3 (primary) + React 19 islands — both coexist intentionally to showcase range.
- **CMS:** Sanity. Studio lives in `studio/`, deployed separately from the site.
- **Hosting:** Cloudflare **Pages**, not Workers. This matters: the Workers flow runs `npx wrangler deploy`, which auto-adds `@astrojs/cloudflare` and rebuilds for the Workers runtime, where the native `@resvg/resvg-js` binary used for OG images cannot load. Pages simply uploads `dist/`. Never add the Cloudflare adapter or a `wrangler.jsonc`.
- **Styling:** Tailwind CSS v4 via `@tailwindcss/vite`. Theme defined CSS-first in `@theme` + CSS custom properties — tokens are the single source of truth.
- **TypeScript:** strict mode throughout.
- **Rendering:** SSG — build-time fetch from Sanity, no per-request server. Interactive demos are client-side islands.
- **Linting:** Biome owns the whole repo, `studio/` included. There is deliberately no ESLint/Prettier in `studio/`.

## Commands

```bash
npm run dev          # astro dev
npm run build        # astro build
npm run preview      # astro preview
npm run check        # astro check (TypeScript)
npm run lint         # biome check .
npm run test         # Vitest unit tests
npm run test:e2e     # Playwright smoke + axe a11y

cd studio && npm run dev      # Sanity Studio locally
cd studio && npm run deploy   # publish the hosted Studio
```

CI on every push/PR: `check` → `lint` → `test` → `build` → Playwright.

**Never check whether a gate passed by truncating its output** (`npm run lint | tail -2` will happily hide the error and show you blank lines). Read enough output to see a verdict, or key off the exit status.

## Planned repository structure

```
/
├─ src/
│  ├─ content/           # Sanity client, GROQ queries, generated types
│  ├─ layouts/
│  ├─ pages/             # Astro file-based routes
│  ├─ features/
│  │  ├─ blog/
│  │  ├─ work/
│  │  └─ playground/
│  │     ├─ _registry.ts # single registry of every demo (id, title, framework, loader)
│  │     ├─ color-contrast/   # Vue island
│  │     ├─ command-palette/  # Vue island
│  │     ├─ states-quartet/   # Vue island
│  │     └─ token-studio/     # React island
│  ├─ components/        # cross-feature primitives (Button, Prose, ThemeToggle, Seal…)
│  ├─ styles/            # global.css with @theme tokens
│  ├─ assets/fonts/      # build-time-only font (OG images); NOT served
│  └─ lib/               # framework-agnostic helpers
├─ studio/               # Sanity Studio — schemas in TypeScript, own package.json
├─ specs/                # per-feature implementation specs
├─ docs/                 # planning documents + progress checklist
└─ public/               # served as-is: fonts, images, robots.txt, favicon
```

The `_registry.ts` pattern keeps the Playground open/closed: adding a demo is one new folder + one registry entry.

## Design system — "余白 / Yohaku"

The visual language is Japanese minimalist — spatial and tonal, not textual. The aesthetic is expressed through spacing, typography, color, and the single accent element, not Japanese characters on the page.

- **Signature element:** a vermilion hanko seal (判子) stamps onto the page on load. Carries **カ** (katakana initial of *Caio*). This is the **only non-Latin character on the site** — a logo mark, not cultural decoration.
- **Hero layout:** two-column — text left (~60%), profile photo right (~40%). Gives text room in natural LTR flow; the empty photo slot is intentional yohaku. Mobile: single column, photo first.
- **Section labels:** `.eyebrow` class — JetBrains Mono, uppercase, tracked, `--ink-faint`. Horizontal, English only. No sidebar gutter or vertical labels.
- **Theme toggle:** dark/light via `data-theme` on `<html>`. System preference honoured on first paint (no flash). Persisted across visits.
- **Motion:** all animations inside `@media (prefers-reduced-motion: no-preference)`. Reduced-motion users see static final states.
- **Radius:** mostly 0. Exceptions: `--radius-seal: 8px` (hanko), `--radius-1: 4px` (small controls).
- **Focus:** 2px `--shu` ring, 2px offset, always visible. Touch targets ≥ 44px.
- **Seal aria:** first occurrence (brand logo) gets `aria-label="Caio"`; all other instances are `aria-hidden="true"`.

### Color tokens (OKLCH, CSS custom properties)
Light = "紙 / Washi", Dark = "墨 / Sumi". Key tokens: `--paper`, `--surface`, `--surface-sunk`, `--ink`, `--ink-muted`, `--ink-faint`, `--line`, `--shu` (vermilion accent), `--shu-strong` (AA-safe accent text), `--shu-soft` (wash), `--ai` (rare indigo), `--on-shu`. Full values in `docs/03-design-system.md` §2.

**Contrast rule:** use `--shu-strong` (not `--shu`) for text links on washi — `--shu` alone is borderline for small text.

**Link rule:** a link sitting inside a run of text must be distinguishable *without* colour (WCAG 1.4.1), so it carries a permanently visible `--shu` hairline underline that deepens on hover/focus. Colour alone fails the Lighthouse a11y audit.

### Typography
- Display (headings, hero): `Zen Old Mincho`
- Body (prose, UI, JP labels): `Zen Kaku Gothic New`
- Mono (dates, romaji labels, code): `JetBrains Mono`

Self-hosted as subsetted `woff2` in `public/fonts/` (latin range + a single-glyph subset for the seal's カ), declared as `@font-face` in `global.css`. No Google Fonts CDN at runtime.

**Preflight caveat:** Tailwind resets headings to `font-size: inherit; font-weight: inherit`. Anything rendering bare `<h2>`/`<h3>` — notably Portable Text prose — needs explicit size and weight, or every heading renders at body size. See the `.prose` rules in `global.css`.

## Sanity content schemas

Five document types in `studio/schemas/`: `profile` (singleton), `post`, `project`, `experience`, `series`. Field-level schemas are in `docs/02-stack-and-services.md` §4.

Each is mirrored as a **Zod schema** in `src/content/schemas.ts`, and the build fails on mismatch (e.g. image missing alt). This enforces a11y and data quality at the type layer, not by convention.

**GROQ null trap — read before touching `src/content/`.** A GROQ *projection* returns `null` for a field the document leaves unset, but Zod's `.optional()` and `.default()` only admit `undefined`. Every optional field selected through a projection must therefore go through the `optional()` / `withDefault()` helpers in `schemas.ts`. Getting this wrong does not fail locally on fixtures — it fails the production build the first time someone publishes a document with that field empty. It has already broken deploys twice (`profile.cv`, `post.updatedAt`).

Files are not images: an image resolves through `urlFor()` from `asset._ref`, but a **file** (e.g. `profile.cv`) has no URL builder and must be dereferenced in GROQ as `cv{asset->{url}}`.

## Environment variables

```
SANITY_PROJECT_ID
SANITY_DATASET
SANITY_API_VERSION
SANITY_READ_TOKEN   # build-time only, never exposed to client
```

Stored in `.env` (git-ignored), as Cloudflare Pages build env vars, and as GitHub Actions secrets. Never expose write tokens.

Without these the build falls back to `src/content/fixtures.ts` and logs a warning **instead of failing** — so a green build proves nothing on its own. Check for the fixtures warning in any build log before trusting it.

`studio/` needs no `.env`: the projectId is public and hardcoded in `sanity.config.ts`, and auth is per-machine via `sanity login`.

## Quality floor (non-negotiable)

- Lighthouse ≥ 95 on all four categories for content pages.
- WCAG 2.2 AA — run axe in Playwright on key routes.
- Content pages ship ~0 KB JS; islands hydrate in isolation.
- `astro check` (types), lint, and build must all pass in CI.
- Content fetch failures at build time fail the build loudly.

### Measured (2026-07-21, live, desktop preset)

| Route | Perf | A11y | Best practices | SEO |
|---|---|---|---|---|
| `/` | 95 | 100 | 100 | 92 |
| `/blog/[slug]` | 100 | 96 | 100 | 92 |

Both misses were fixed after this run and **need re-measuring once deployed**: SEO 92 was a missing `robots.txt`, and a11y 96 was `link-in-text-block` (colour-only links). Content pages ship **0 KB** of JS.

Re-run with:

```bash
CHROME_PATH=/usr/bin/google-chrome npx lighthouse https://caio-alfonso.pages.dev/ \
  --preset=desktop --chrome-flags="--headless=new"
```

### Testing e2e reliably

Two races bit this suite and are guarded in `tests/smoke.spec.ts`; preserve both when adding tests:

- **Wait for animations before running axe.** Entry animations start at `opacity: 0`, and scanning mid-flight makes axe measure blended colours and report phantom contrast failures. Skip looping animations (the `/about` availability pulse never finishes).
- **Wait for hydration before driving an island.** Listeners bind in `onMounted`, so input sent earlier is silently dropped. Astro removes the `ssr` attribute from `<astro-island>` once hydrated.

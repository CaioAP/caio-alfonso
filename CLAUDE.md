# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Personal portfolio + daily frontend blog for Caio. **Currently in the planning phase** — all specs are in `docs/`, no implementation exists yet. The planning docs are the authoritative source of truth; read them before making architectural decisions.

| Doc | Contents |
|---|---|
| `docs/00-project-spec.md` | Goals, IA, functional requirements, quality floor |
| `docs/01-architecture-decisions.md` | ADRs (framework, CMS, hosting, styling, rendering, repo structure) |
| `docs/02-stack-and-services.md` | Full stack, Sanity content schemas, publish pipeline, cost breakdown |
| `docs/03-design-system.md` | Design tokens, typography, `global.css`, a11y rules |
| `docs/04-showcase-and-blog-backlog.md` | Playground demo ideas + blog topic backlog |
| `docs/05-delivery-roadmap.md` | Phased plan and definitions of done |

## Locked decisions (as of 2026-06-30)

- **Framework:** Astro 6 shell with Vue 3 (primary) + React 19 islands — both frameworks coexist intentionally to showcase range.
- **CMS:** Sanity (free tier). Sanity Studio fires a webhook → Cloudflare Pages rebuild on publish.
- **Hosting:** Cloudflare Pages (unlimited bandwidth, commercial-OK, free).
- **Styling:** Tailwind CSS v4 via `@tailwindcss/vite` (not the deprecated `@astrojs/tailwind`). Theme defined CSS-first in `@theme` + CSS custom properties — tokens are the single source of truth.
- **TypeScript:** strict mode throughout. Sanity schema types are generated.
- **Rendering:** SSG — build-time fetch from Sanity, no per-request server. Interactive demos are client-side islands.

## Planned commands (set these up in Phase 0)

```bash
npm run dev          # astro dev
npm run build        # astro build
npm run preview      # astro preview
npm run check        # astro check (TypeScript)
npm run lint         # ESLint / Biome
npm run test         # Vitest unit tests
npm run test:e2e     # Playwright smoke + axe a11y
```

CI on every PR: `astro check` → lint → `astro build` → Playwright.

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
│  │     └─ token-studio/     # React island
│  ├─ components/        # cross-feature primitives (Button, Prose, ThemeToggle, Seal…)
│  ├─ styles/            # global.css with @theme tokens
│  └─ lib/               # framework-agnostic helpers
├─ studio/               # Sanity Studio — schemas in TypeScript
├─ docs/                 # planning documents
└─ public/
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

**Contrast rule:** use `--shu-strong` (not `--shu`) for text links on washi — `--shu` alone is borderline for small text. Preferred pattern: ink-coloured text + animated `--shu` hairline underline.

### Typography
- Display (headings, hero): `Zen Old Mincho`
- Body (prose, UI, JP labels): `Zen Kaku Gothic New`
- Mono (dates, romaji labels, code): `JetBrains Mono`
- All from Google Fonts; self-host subsetted `woff2` in production.

## Sanity content schemas

Four document types defined in `studio/` (TypeScript schemas): `profile` (singleton), `post`, `project`, `experience`. Field-level schemas are in `docs/02-stack-and-services.md` §4.

Mirror each schema as a **Zod schema** on the app side and fail the build on mismatch (e.g. image missing alt). This enforces a11y and data quality at the type layer, not by convention.

## Environment variables

```
SANITY_PROJECT_ID
SANITY_DATASET
SANITY_API_VERSION
SANITY_READ_TOKEN   # build-time only, never exposed to client
```

Stored in `.env` (git-ignored) and as Cloudflare Pages build env vars. Never expose write tokens.

## Quality floor (non-negotiable)

- Lighthouse ≥ 95 on all four categories for content pages.
- WCAG 2.2 AA — run axe in Playwright on key routes.
- Content pages ship ~0 KB JS; islands hydrate in isolation.
- `astro check` (types), lint, and build must all pass in CI.
- Content fetch failures at build time fail the build loudly.
